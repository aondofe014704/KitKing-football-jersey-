import { Response, NextFunction } from 'express';
import { PaymentsService } from './payments.service';
import { AuthRequest } from '../../middleware/auth.middleware';
import { sendSuccess } from '../../utils/response.utils';

const paymentsService = new PaymentsService();

export class PaymentsController {
  async initializePaystack(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await paymentsService.initializePaystack(req.params.orderId, req.user!.userId);
      sendSuccess(res, result, 'Payment initialized');
    } catch (error) {
      next(error);
    }
  }

  async verifyPaystack(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await paymentsService.verifyPaystack(req.params.reference);
      sendSuccess(res, result, result.verified ? 'Payment verified successfully' : 'Payment not verified');
    } catch (error) {
      next(error);
    }
  }

  async initializeFlutterwave(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await paymentsService.initializeFlutterwave(req.params.orderId, req.user!.userId);
      sendSuccess(res, result, 'Payment initialized');
    } catch (error) {
      next(error);
    }
  }

  async getPaymentStatus(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const status = await paymentsService.getPaymentStatus(req.params.orderId, req.user!.userId);
      sendSuccess(res, status, 'Payment status retrieved');
    } catch (error) {
      next(error);
    }
  }
}
