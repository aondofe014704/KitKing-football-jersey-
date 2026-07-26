import { Response, NextFunction } from 'express';
import { WishlistService } from './wishlist.service';
import { AuthRequest } from '../../middleware/auth.middleware';
import { sendSuccess } from '../../utils/response.utils';

const wishlistService = new WishlistService();

export class WishlistController {
  async getWishlist(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const items = await wishlistService.getWishlist(req.user!.userId);
      sendSuccess(res, items, 'Wishlist retrieved');
    } catch (error) {
      next(error);
    }
  }

  async toggleWishlist(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await wishlistService.toggleWishlist(req.user!.userId, req.params.productId);
      sendSuccess(res, result, result.added ? 'Added to wishlist' : 'Removed from wishlist');
    } catch (error) {
      next(error);
    }
  }

  async removeFromWishlist(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await wishlistService.removeFromWishlist(req.user!.userId, req.params.productId);
      sendSuccess(res, null, 'Removed from wishlist');
    } catch (error) {
      next(error);
    }
  }
}
