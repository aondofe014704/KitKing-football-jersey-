import { Response, NextFunction } from 'express';
import { UsersService } from './users.service';
import { AuthRequest } from '../../middleware/auth.middleware';
import { sendSuccess } from '../../utils/response.utils';

const usersService = new UsersService();

export class UsersController {
  async getAllUsers(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await usersService.getAllUsers(req.query as { page?: string; limit?: string; search?: string });
      sendSuccess(res, result.users, 'Users retrieved', 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await usersService.getUserById(req.params.id);
      sendSuccess(res, user, 'User retrieved');
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await usersService.updateProfile(req.user!.userId, req.body);
      sendSuccess(res, user, 'Profile updated');
    } catch (error) {
      next(error);
    }
  }

  async toggleUserStatus(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await usersService.toggleUserStatus(req.params.id);
      sendSuccess(res, result, 'User status updated');
    } catch (error) {
      next(error);
    }
  }

  async addAddress(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const address = await usersService.addAddress(req.user!.userId, req.body);
      sendSuccess(res, address, 'Address added', 201);
    } catch (error) {
      next(error);
    }
  }

  async updateAddress(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const address = await usersService.updateAddress(req.params.id, req.user!.userId, req.body);
      sendSuccess(res, address, 'Address updated');
    } catch (error) {
      next(error);
    }
  }

  async deleteAddress(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await usersService.deleteAddress(req.params.id, req.user!.userId);
      sendSuccess(res, null, 'Address deleted');
    } catch (error) {
      next(error);
    }
  }
}
