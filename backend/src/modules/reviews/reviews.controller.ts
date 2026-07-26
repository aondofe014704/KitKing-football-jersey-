import { Request, Response, NextFunction } from 'express';
import { ReviewsService } from './reviews.service';
import { AuthRequest } from '../../middleware/auth.middleware';
import { sendSuccess } from '../../utils/response.utils';

const reviewsService = new ReviewsService();

export class ReviewsController {
  async createReview(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const review = await reviewsService.createReview(req.user!.userId, req.body);
      sendSuccess(res, review, 'Review submitted. Pending approval.', 201);
    } catch (error) {
      next(error);
    }
  }

  async getProductReviews(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await reviewsService.getProductReviews(req.params.productId);
      sendSuccess(res, data, 'Reviews retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getAllReviews(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await reviewsService.getAllReviews(req.query as Record<string, string>);
      sendSuccess(res, result.reviews, 'Reviews retrieved');
    } catch (error) {
      next(error);
    }
  }

  async approveReview(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const review = await reviewsService.approveReview(req.params.id);
      sendSuccess(res, review, 'Review approved');
    } catch (error) {
      next(error);
    }
  }

  async deleteReview(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await reviewsService.deleteReview(req.params.id);
      sendSuccess(res, null, 'Review deleted');
    } catch (error) {
      next(error);
    }
  }
}
