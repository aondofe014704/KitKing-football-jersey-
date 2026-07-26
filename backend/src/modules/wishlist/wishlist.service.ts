import { prisma } from '../../config/database';

export class WishlistService {
  async getWishlist(userId: string) {
    return prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            images: { where: { isPrimary: true }, take: 1 },
            variants: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async toggleWishlist(userId: string, productId: string) {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw { statusCode: 404, message: 'Product not found' };

    const existing = await prisma.wishlistItem.findUnique({
      where: { userId_productId: { userId, productId } },
    });

    if (existing) {
      await prisma.wishlistItem.delete({
        where: { userId_productId: { userId, productId } },
      });
      return { added: false };
    } else {
      await prisma.wishlistItem.create({ data: { userId, productId } });
      return { added: true };
    }
  }

  async removeFromWishlist(userId: string, productId: string) {
    await prisma.wishlistItem.delete({
      where: { userId_productId: { userId, productId } },
    });
  }

  async isInWishlist(userId: string, productId: string) {
    const item = await prisma.wishlistItem.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    return { inWishlist: !!item };
  }
}
