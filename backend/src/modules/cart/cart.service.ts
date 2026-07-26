import { prisma } from '../../config/database';

export class CartService {
  async getCart(userId: string) {
    const items = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            images: { where: { isPrimary: true }, take: 1 },
          },
        },
        variant: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    const subtotal = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    return { items, subtotal, count: items.length };
  }

  async addToCart(userId: string, productId: string, variantId: string, quantity = 1) {
    // Validate product and variant
    const variant = await prisma.productVariant.findFirst({
      where: { id: variantId, productId },
    });

    if (!variant) throw { statusCode: 404, message: 'Product variant not found' };
    if (variant.stock < quantity) {
      throw { statusCode: 400, message: `Only ${variant.stock} items left in stock` };
    }

    const existing = await prisma.cartItem.findUnique({
      where: { userId_variantId: { userId, variantId } },
    });

    if (existing) {
      const newQty = existing.quantity + quantity;
      if (variant.stock < newQty) {
        throw { statusCode: 400, message: `Only ${variant.stock} items available` };
      }
      return prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: newQty },
        include: {
          product: { include: { images: { where: { isPrimary: true }, take: 1 } } },
          variant: true,
        },
      });
    }

    return prisma.cartItem.create({
      data: { userId, productId, variantId, quantity },
      include: {
        product: { include: { images: { where: { isPrimary: true }, take: 1 } } },
        variant: true,
      },
    });
  }

  async updateCartItem(userId: string, cartItemId: number, quantity: number) {
    const item = await prisma.cartItem.findFirst({
      where: { id: cartItemId, userId },
      include: { variant: true },
    });

    if (!item) throw { statusCode: 404, message: 'Cart item not found' };

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: cartItemId } });
      return null;
    }

    if (item.variant.stock < quantity) {
      throw { statusCode: 400, message: `Only ${item.variant.stock} items available` };
    }

    return prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
      include: {
        product: { include: { images: { where: { isPrimary: true }, take: 1 } } },
        variant: true,
      },
    });
  }

  async removeFromCart(userId: string, cartItemId: number) {
    const item = await prisma.cartItem.findFirst({ where: { id: cartItemId, userId } });
    if (!item) throw { statusCode: 404, message: 'Cart item not found' };

    await prisma.cartItem.delete({ where: { id: cartItemId } });
  }

  async clearCart(userId: string) {
    await prisma.cartItem.deleteMany({ where: { userId } });
  }
}
