import { prisma } from '../../config/database';

export class CouponsService {
  async getAllCoupons() {
    return prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async validateCoupon(code: string, subtotal: number) {
    const coupon = await prisma.coupon.findUnique({ where: { code } });

    if (!coupon) throw { statusCode: 404, message: 'Invalid coupon code' };
    if (!coupon.isActive) throw { statusCode: 400, message: 'This coupon is no longer active' };
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      throw { statusCode: 400, message: 'This coupon has expired' };
    }
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      throw { statusCode: 400, message: 'This coupon has reached its usage limit' };
    }
    if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
      throw { statusCode: 400, message: `Minimum order amount is ₦${coupon.minOrderAmount.toLocaleString()}` };
    }

    const discount = coupon.type === 'PERCENTAGE'
      ? Math.round((subtotal * coupon.value) / 100)
      : Math.min(coupon.value, subtotal);

    return { coupon, discount };
  }

  async createCoupon(data: {
    code: string;
    type: 'PERCENTAGE' | 'FIXED';
    value: number;
    minOrderAmount?: number;
    maxUses?: number;
    isActive?: boolean;
    description?: string;
    expiresAt?: string;
  }) {
    return prisma.coupon.create({
      data: {
        ...data,
        code: data.code.toUpperCase(),
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
      },
    });
  }

  async updateCoupon(id: string, data: Partial<{
    isActive: boolean;
    maxUses: number;
    expiresAt: string;
    value: number;
    description: string;
  }>) {
    return prisma.coupon.update({
      where: { id },
      data: {
        ...data,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
      },
    });
  }

  async deleteCoupon(id: string) {
    await prisma.coupon.delete({ where: { id } });
  }
}
