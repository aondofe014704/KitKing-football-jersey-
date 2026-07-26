import { prisma } from '../../config/database';

export class ReviewsService {
  async createReview(userId: string, data: {
    productId: string;
    rating: number;
    title: string;
    body: string;
  }) {
    // Check if user has ordered this product
    const hasOrdered = await prisma.orderItem.findFirst({
      where: {
        productId: data.productId,
        order: { userId, status: 'DELIVERED' },
      },
    });

    const existingReview = await prisma.review.findUnique({
      where: { userId_productId: { userId, productId: data.productId } },
    });

    if (existingReview) {
      throw { statusCode: 400, message: 'You have already reviewed this product' };
    }

    return prisma.review.create({
      data: {
        ...data,
        userId,
        isVerified: !!hasOrdered,
      },
      include: {
        user: { select: { firstName: true, lastName: true, avatar: true } },
      },
    });
  }

  async getProductReviews(productId: string) {
    const [reviews, stats] = await Promise.all([
      prisma.review.findMany({
        where: { productId, isApproved: true },
        include: {
          user: { select: { firstName: true, lastName: true, avatar: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.review.groupBy({
        by: ['rating'],
        where: { productId, isApproved: true },
        _count: { rating: true },
      }),
    ]);

    const totalReviews = reviews.length;
    const avgRating = totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

    const ratingBreakdown = [1, 2, 3, 4, 5].map((star) => {
      const found = stats.find((s) => s.rating === star);
      return { star, count: found?._count.rating || 0 };
    });

    return { reviews, totalReviews, avgRating: Math.round(avgRating * 10) / 10, ratingBreakdown };
  }

  async getAllReviews(query: { page?: string; limit?: string; approved?: string }) {
    const page = parseInt(query.page || '1');
    const limit = parseInt(query.limit || '20');
    const skip = (page - 1) * limit;

    const where = query.approved !== undefined
      ? { isApproved: query.approved === 'true' }
      : {};

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { firstName: true, lastName: true } },
          product: { select: { name: true, slug: true } },
        },
      }),
      prisma.review.count({ where }),
    ]);

    return { reviews, total };
  }

  async approveReview(reviewId: string) {
    return prisma.review.update({
      where: { id: reviewId },
      data: { isApproved: true },
    });
  }

  async deleteReview(reviewId: string) {
    await prisma.review.delete({ where: { id: reviewId } });
  }
}
