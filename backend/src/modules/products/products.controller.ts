import { Request, Response, NextFunction } from 'express';
import { ProductsService } from './products.service';
import { AuthRequest } from '../../middleware/auth.middleware';
import { sendSuccess } from '../../utils/response.utils';

const productsService = new ProductsService();

export class ProductsController {
  async getAllProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await productsService.getAllProducts(req.query as Record<string, string>);
      sendSuccess(res, result.products, 'Products retrieved', 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  async getProductBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await productsService.getProductBySlug(req.params.slug);
      sendSuccess(res, product, 'Product retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getProductById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await productsService.getProductById(req.params.id);
      sendSuccess(res, product, 'Product retrieved');
    } catch (error) {
      next(error);
    }
  }

  async createProduct(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await productsService.createProduct(req.body);
      sendSuccess(res, product, 'Product created', 201);
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await productsService.updateProduct(req.params.id, req.body);
      sendSuccess(res, product, 'Product updated');
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await productsService.deleteProduct(req.params.id);
      sendSuccess(res, null, 'Product deleted');
    } catch (error) {
      next(error);
    }
  }

  async addProductImage(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const image = await productsService.addProductImage(req.params.id, req.body);
      sendSuccess(res, image, 'Image added', 201);
    } catch (error) {
      next(error);
    }
  }

  async deleteProductImage(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await productsService.deleteProductImage(req.params.imageId);
      sendSuccess(res, null, 'Image deleted');
    } catch (error) {
      next(error);
    }
  }

  async getRelatedProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const products = await productsService.getRelatedProducts(req.params.id);
      sendSuccess(res, products, 'Related products retrieved');
    } catch (error) {
      next(error);
    }
  }
}
