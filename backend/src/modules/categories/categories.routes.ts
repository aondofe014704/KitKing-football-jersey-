import { Router } from 'express';
import { CategoriesController } from './categories.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requireAdmin } from '../../middleware/admin.middleware';

const router = Router();
const controller = new CategoriesController();

router.get('/', controller.getAllCategories.bind(controller));
router.get('/:slug', controller.getCategoryBySlug.bind(controller));
router.post('/', authenticate, requireAdmin, controller.createCategory.bind(controller));
router.patch('/:id', authenticate, requireAdmin, controller.updateCategory.bind(controller));
router.delete('/:id', authenticate, requireAdmin, controller.deleteCategory.bind(controller));

export default router;
