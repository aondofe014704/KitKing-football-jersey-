import { Request, Response, NextFunction } from 'express';
import { OrdersService } from './orders.service';
import { AuthRequest } from '../../middleware/auth.middleware';
import { sendSuccess } from '../../utils/response.utils';

const ordersService = new OrdersService();

export class OrdersController {
  async createOrder(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const order = await ordersService.createOrder(req.user!.userId, req.body);
      sendSuccess(res, order, 'Order placed successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getMyOrders(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await ordersService.getMyOrders(req.user!.userId, req.query as Record<string, string>);
      sendSuccess(res, result.orders, 'Orders retrieved', 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  async getMyOrderById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const order = await ordersService.getOrderById(req.params.id, req.user!.userId);
      sendSuccess(res, order, 'Order retrieved');
    } catch (error) {
      next(error);
    }
  }

  async trackOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const order = await ordersService.getOrderByNumber(req.params.orderNumber);
      sendSuccess(res, order, 'Order found');
    } catch (error) {
      next(error);
    }
  }

  async cancelOrder(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const order = await ordersService.cancelOrder(req.params.id, req.user!.userId);
      sendSuccess(res, order, 'Order cancelled');
    } catch (error) {
      next(error);
    }
  }

  // Admin
  async getAllOrders(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await ordersService.getAllOrders(req.query as Record<string, string>);
      sendSuccess(res, result.orders, 'Orders retrieved', 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  async getOrderById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const order = await ordersService.getOrderById(req.params.id);
      sendSuccess(res, order, 'Order retrieved');
    } catch (error) {
      next(error);
    }
  }

  async updateOrderStatus(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const order = await ordersService.updateOrderStatus(req.params.id, req.body);
      sendSuccess(res, order, 'Order status updated');
    } catch (error) {
      next(error);
    }
  }
}
