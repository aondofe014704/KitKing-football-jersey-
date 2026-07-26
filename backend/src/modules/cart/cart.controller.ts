import { Response, NextFunction } from 'express';
import { CartService } from './cart.service';
import { AuthRequest } from '../../middleware/auth.middleware';
import { sendSuccess } from '../../utils/response.utils';

const cartService = new CartService();

export class CartController {
  async getCart(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const cart = await cartService.getCart(req.user!.userId);
      sendSuccess(res, cart, 'Cart retrieved');
    } catch (error) {
      next(error);
    }
  }

  async addToCart(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { productId, variantId, quantity } = req.body;
      const item = await cartService.addToCart(req.user!.userId, productId, variantId, quantity);
      sendSuccess(res, item, 'Item added to cart', 201);
    } catch (error) {
      next(error);
    }
  }

  async updateCartItem(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const item = await cartService.updateCartItem(
        req.user!.userId,
        parseInt(req.params.id),
        req.body.quantity
      );
      sendSuccess(res, item, item ? 'Cart updated' : 'Item removed from cart');
    } catch (error) {
      next(error);
    }
  }

  async removeFromCart(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await cartService.removeFromCart(req.user!.userId, parseInt(req.params.id));
      sendSuccess(res, null, 'Item removed from cart');
    } catch (error) {
      next(error);
    }
  }

  async clearCart(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await cartService.clearCart(req.user!.userId);
      sendSuccess(res, null, 'Cart cleared');
    } catch (error) {
      next(error);
    }
  }
}
