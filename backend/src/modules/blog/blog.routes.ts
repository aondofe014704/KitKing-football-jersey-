import { Router } from 'express';
import { BlogController } from './blog.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requireAdmin } from '../../middleware/admin.middleware';

const router = Router();
const controller = new BlogController();

router.get('/', controller.getAllPosts.bind(controller));
router.get('/:slug', controller.getPostBySlug.bind(controller));

// Admin
router.post('/', authenticate, requireAdmin, controller.createPost.bind(controller));
router.patch('/:id', authenticate, requireAdmin, controller.updatePost.bind(controller));
router.delete('/:id', authenticate, requireAdmin, controller.deletePost.bind(controller));

export default router;
