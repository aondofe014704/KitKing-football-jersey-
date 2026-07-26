import { prisma } from '../../config/database';
import { getPaginationParams, buildPaginationMeta } from '../../utils/response.utils';
import { CreateOrderInput, UpdateOrderStatusInput } from './orders.schema';

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `KK-${timestamp}-${random}`;
}

export class OrdersService {
  async createOrder(userId: string, data: CreateOrderInput) {
    // Validate address belongs to user
    const address = await prisma.address.findFirst({
      where: { id: data.shippingAddressId, userId },
    });
    if (!address) throw { statusCode: 404, message: 'Shipping address not found' };

    // Fetch products and variants
    const orderItemsData = await Promise.all(
      data.items.map(async (item) => {
        const variant = await prisma.productVariant.findUnique({
          where: { id: item.variantId },
          include: {
            product: {
              include: { images: { where: { isPrimary: true }, take: 1 } },
            },
          },
        });

        if (!variant) throw { statusCode: 404, message: `Variant ${item.variantId} not found` };
        if (variant.productId !== item.productId) throw { statusCode: 400, message: 'Product/variant mismatch' };
        if (variant.stock < item.quantity) {
          throw { statusCode: 400, message: `Insufficient stock for ${variant.product.name} (${variant.size})` };
        }

        return {
          productId: item.productId,
          variantId: item.variantId,
          productName: variant.product.name,
          productImage: variant.product.images[0]?.url || '',
          size: variant.size,
          quantity: item.quantity,
          unitPrice: variant.product.price,
          totalPrice: variant.product.price * item.quantity,
        };
      })
    );

    const subtotal = orderItemsData.reduce((sum, item) => sum + item.totalPrice, 0);

    // Get delivery fee
    let shippingFee = 0;
    if (data.deliveryZoneId) {
      const zone = await prisma.deliveryZone.findUnique({ where: { id: data.deliveryZoneId } });
      if (zone) shippingFee = zone.shippingFee;
    }

    // Apply coupon
    let discount = 0;
    if (data.couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: data.couponCode } });
      if (!coupon || !coupon.isActive) throw { statusCode: 400, message: 'Invalid or expired coupon' };
      if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) throw { statusCode: 400, message: 'Coupon has expired' };
      if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
        throw { statusCode: 400, message: `Minimum order amount for this coupon is ₦${coupon.minOrderAmount.toLocaleString()}` };
      }
      if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) throw { statusCode: 400, message: 'Coupon usage limit reached' };

      discount = coupon.type === 'PERCENTAGE'
        ? Math.round((subtotal * coupon.value) / 100)
        : Math.min(coupon.value, subtotal);

      await prisma.coupon.update({
        where: { id: coupon.id },
        data: { usedCount: { increment: 1 } },
      });
    }

    const total = subtotal + shippingFee - discount;

    // Create order and update stock atomically
    const order = await prisma.$transaction(async (tx) => {
      // Deduct stock
      for (const item of data.items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Clear cart items for these products
      await tx.cartItem.deleteMany({
        where: {
          userId,
          variantId: { in: data.items.map((i) => i.variantId) },
        },
      });

      return tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId,
          shippingAddressId: data.shippingAddressId,
          deliveryZoneId: data.deliveryZoneId,
          paymentMethod: data.paymentMethod,
          couponCode: data.couponCode,
          notes: data.notes,
          subtotal,
          shippingFee,
          discount,
          total,
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: true,
          shippingAddress: true,
          deliveryZone: true,
        },
      });
    });

    return order;
  }

  async getMyOrders(userId: string, query: { page?: string; limit?: string }) {
    const { page, limit, skip } = getPaginationParams(query);

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
          shippingAddress: true,
        },
      }),
      prisma.order.count({ where: { userId } }),
    ]);

    return { orders, meta: buildPaginationMeta(total, page, limit) };
  }

  async getOrderById(id: string, userId?: string) {
    const where: Record<string, unknown> = { id };
    if (userId) where.userId = userId;

    const order = await prisma.order.findFirst({
      where,
      include: {
        items: {
          include: {
            product: {
              select: { slug: true },
            },
          },
        },
        shippingAddress: true,
        deliveryZone: true,
        user: { select: { email: true, firstName: true, lastName: true, phone: true } },
      },
    });

    if (!order) throw { statusCode: 404, message: 'Order not found' };
    return order;
  }

  async getOrderByNumber(orderNumber: string, userId?: string) {
    const where: Record<string, unknown> = { orderNumber };
    if (userId) where.userId = userId;

    const order = await prisma.order.findFirst({
      where,
      include: {
        items: true,
        shippingAddress: true,
        deliveryZone: true,
      },
    });

    if (!order) throw { statusCode: 404, message: 'Order not found' };
    return order;
  }

  async getAllOrders(query: {
    page?: string;
    limit?: string;
    status?: string;
    search?: string;
  }) {
    const { page, limit, skip } = getPaginationParams(query);

    const where: Record<string, unknown> = {};
    if (query.status) where.status = query.status;
    if (query.search) {
      where.OR = [
        { orderNumber: { contains: query.search, mode: 'insensitive' } },
        { user: { email: { contains: query.search, mode: 'insensitive' } } },
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: { take: 1 },
          user: { select: { email: true, firstName: true, lastName: true } },
          shippingAddress: true,
        },
      }),
      prisma.order.count({ where }),
    ]);

    return { orders, meta: buildPaginationMeta(total, page, limit) };
  }

  async updateOrderStatus(id: string, data: UpdateOrderStatusInput) {
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) throw { statusCode: 404, message: 'Order not found' };

    return prisma.order.update({
      where: { id },
      data: {
        status: data.status,
        ...(data.trackingNumber && { trackingNumber: data.trackingNumber }),
        ...(data.status === 'DELIVERED' && { paymentStatus: 'PAID' }),
      },
    });
  }

  async cancelOrder(id: string, userId: string) {
    const order = await prisma.order.findFirst({ where: { id, userId } });
    if (!order) throw { statusCode: 404, message: 'Order not found' };

    if (!['PENDING', 'CONFIRMED'].includes(order.status)) {
      throw { statusCode: 400, message: 'Order cannot be cancelled at this stage' };
    }

    // Restore stock
    const items = await prisma.orderItem.findMany({ where: { orderId: id } });
    for (const item of items) {
      if (item.variantId) {
        await prisma.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { increment: item.quantity } },
        });
      }
    }

    return prisma.order.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }
}
