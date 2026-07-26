import { Request, Response, NextFunction } from 'express';
import { CategoriesService } from './categories.service';
import { AuthRequest } from '../../middleware/auth.middleware';
import { sendSuccess } from '../../utils/response.utils';

const categoriesService = new CategoriesService();

export class CategoriesController {
  async getAllCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await categoriesService.getAllCategories();
      sendSuccess(res, categories, 'Categories retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getCategoryBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = await categoriesService.getCategoryBySlug(req.params.slug);
      sendSuccess(res, category, 'Category retrieved');
    } catch (error) {
      next(error);
    }
  }

  async createCategory(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = await categoriesService.createCategory(req.body);
      sendSuccess(res, category, 'Category created', 201);
    } catch (error) {
      next(error);
    }
  }

  async updateCategory(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = await categoriesService.updateCategory(req.params.id, req.body);
      sendSuccess(res, category, 'Category updated');
    } catch (error) {
      next(error);
    }
  }

  async deleteCategory(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await categoriesService.deleteCategory(req.params.id);
      sendSuccess(res, null, 'Category deleted');
    } catch (error) {
      next(error);
    }
  }
}
