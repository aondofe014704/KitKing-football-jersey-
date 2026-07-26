import { prisma } from '../../config/database';
import https from 'https';

export class PaymentsService {
  private paystackSecretKey = process.env.PAYSTACK_SECRET_KEY || '';
  private flutterwaveSecretKey = process.env.FLUTTERWAVE_SECRET_KEY || '';

  async initializePaystack(orderId: string, userId: string) {
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
      include: { user: true },
    });

    if (!order) throw { statusCode: 404, message: 'Order not found' };
    if (order.paymentStatus === 'PAID') throw { statusCode: 400, message: 'Order already paid' };

    const reference = `KK-PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const payload = JSON.stringify({
      email: order.user.email,
      amount: Math.round(order.total * 100), // Paystack uses kobo
      reference,
      metadata: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        userId,
      },
      callback_url: `${process.env.FRONTEND_URL}/checkout/verify?reference=${reference}`,
    });

    return new Promise<{ authorizationUrl: string; reference: string }>((resolve, reject) => {
      const options = {
        hostname: 'api.paystack.co',
        port: 443,
        path: '/transaction/initialize',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.paystackSecretKey}`,
          'Content-Type': 'application/json',
        },
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', async () => {
          const parsed = JSON.parse(data);
          if (!parsed.status) {
            reject({ statusCode: 400, message: parsed.message || 'Payment initialization failed' });
            return;
          }

          await prisma.order.update({
            where: { id: orderId },
            data: { paymentReference: reference },
          });

          resolve({
            authorizationUrl: parsed.data.authorization_url,
            reference: parsed.data.reference,
          });
        });
      });

      req.on('error', (error) => reject(error));
      req.write(payload);
      req.end();
    });
  }

  async verifyPaystack(reference: string) {
    return new Promise<{ order: unknown; verified: boolean }>((resolve, reject) => {
      const options = {
        hostname: 'api.paystack.co',
        port: 443,
        path: `/transaction/verify/${encodeURIComponent(reference)}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.paystackSecretKey}`,
        },
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', async () => {
          const parsed = JSON.parse(data);

          if (!parsed.status || parsed.data.status !== 'success') {
            resolve({ order: null, verified: false });
            return;
          }

          const orderId = parsed.data.metadata?.orderId;
          if (!orderId) {
            reject({ statusCode: 400, message: 'Invalid payment metadata' });
            return;
          }

          const order = await prisma.order.update({
            where: { id: orderId },
            data: {
              paymentStatus: 'PAID',
              status: 'CONFIRMED',
              paymentReference: reference,
            },
          });

          resolve({ order, verified: true });
        });
      });

      req.on('error', (error) => reject(error));
      req.end();
    });
  }

  async initializeFlutterwave(orderId: string, userId: string) {
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
      include: { user: true },
    });

    if (!order) throw { statusCode: 404, message: 'Order not found' };

    const reference = `KK-FLW-${Date.now()}`;

    const payload = {
      tx_ref: reference,
      amount: order.total,
      currency: 'NGN',
      redirect_url: `${process.env.FRONTEND_URL}/checkout/verify?method=flutterwave&reference=${reference}`,
      customer: {
        email: order.user.email,
        name: `${order.user.firstName} ${order.user.lastName}`,
        phone_number: order.user.phone,
      },
      customizations: {
        title: 'KitKing',
        description: `Order #${order.orderNumber}`,
        logo: `${process.env.FRONTEND_URL}/logo.png`,
      },
      meta: {
        orderId: order.id,
        orderNumber: order.orderNumber,
      },
    };

    const response = await fetch('https://api.flutterwave.com/v3/payments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.flutterwaveSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = (await response.json()) as {
      status: string;
      data?: { link: string };
      message?: string;
    };

    if (data.status !== 'success' || !data.data) {
      throw { statusCode: 400, message: data.message || 'Payment initialization failed' };
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { paymentReference: reference },
    });

    return { paymentLink: data.data.link, reference };
  }

  async getPaymentStatus(orderId: string, userId: string) {
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
      select: { id: true, paymentStatus: true, status: true, paymentReference: true },
    });

    if (!order) throw { statusCode: 404, message: 'Order not found' };
    return order;
  }
}
