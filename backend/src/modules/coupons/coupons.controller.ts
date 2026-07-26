import { Request, Response, NextFunction } from 'express';
import { CouponsService } from './coupons.service';
import { AuthRequest } from '../../middleware/auth.middleware';
import { sendSuccess } from '../../utils/response.utils';

const couponsService = new CouponsService();

export class CouponsController {
  async getAllCoupons(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const coupons = await couponsService.getAllCoupons();
      sendSuccess(res, coupons, 'Coupons retrieved');
    } catch (error) {
      next(error);
    }
  }

  async validateCoupon(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { code, subtotal } = req.body;
      const result = await couponsService.validateCoupon(code, parseFloat(subtotal));
      sendSuccess(res, result, 'Coupon valid');
    } catch (error) {
      next(error);
    }
  }

  async createCoupon(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const coupon = await couponsService.createCoupon(req.body);
      sendSuccess(res, coupon, 'Coupon created', 201);
    } catch (error) {
      next(error);
    }
  }

  async updateCoupon(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const coupon = await couponsService.updateCoupon(req.params.id, req.body);
      sendSuccess(res, coupon, 'Coupon updated');
    } catch (error) {
      next(error);
    }
  }

  async deleteCoupon(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await couponsService.deleteCoupon(req.params.id);
      sendSuccess(res, null, 'Coupon deleted');
    } catch (error) {
      next(error);
    }
  }
}
