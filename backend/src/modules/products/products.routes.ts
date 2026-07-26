import { Router } from 'express';
import { ProductsController } from './products.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requireAdmin } from '../../middleware/admin.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createProductSchema, updateProductSchema } from './products.schema';

const router = Router();
const controller = new ProductsController();

// Public routes
router.get('/', controller.getAllProducts.bind(controller));
router.get('/slug/:slug', controller.getProductBySlug.bind(controller));
router.get('/:id/related', controller.getRelatedProducts.bind(controller));
router.get('/:id', controller.getProductById.bind(controller));

// Admin routes
router.post('/', authenticate, requireAdmin, validate(createProductSchema), controller.createProduct.bind(controller));
router.patch('/:id', authenticate, requireAdmin, validate(updateProductSchema), controller.updateProduct.bind(controller));
router.delete('/:id', authenticate, requireAdmin, controller.deleteProduct.bind(controller));
router.post('/:id/images', authenticate, requireAdmin, controller.addProductImage.bind(controller));
router.delete('/:id/images/:imageId', authenticate, requireAdmin, controller.deleteProductImage.bind(controller));

export default router;
