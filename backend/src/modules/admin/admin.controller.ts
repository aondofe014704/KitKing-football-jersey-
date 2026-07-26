import { Request, Response, NextFunction } from 'express';
import { AdminService } from './admin.service';
import { AuthRequest } from '../../middleware/auth.middleware';
import { sendSuccess } from '../../utils/response.utils';

const adminService = new AdminService();

export class AdminController {
  async getDashboardStats(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await adminService.getDashboardStats();
      sendSuccess(res, stats, 'Dashboard stats retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getSalesChart(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const period = (req.query.period as 'week' | 'month' | 'year') || 'month';
      const data = await adminService.getSalesChart(period);
      sendSuccess(res, data, 'Sales chart data retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getTopProducts(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const products = await adminService.getTopProducts();
      sendSuccess(res, products, 'Top products retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getSettings(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const settings = await adminService.getSettings();
      sendSuccess(res, settings, 'Settings retrieved');
    } catch (error) {
      next(error);
    }
  }

  async updateSettings(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const settings = await adminService.updateSettings(req.body);
      sendSuccess(res, settings, 'Settings updated');
    } catch (error) {
      next(error);
    }
  }
}
