import { Router } from 'express';
import { ReviewsController } from './reviews.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requireAdmin } from '../../middleware/admin.middleware';

const router = Router();
const controller = new ReviewsController();

router.get('/product/:productId', controller.getProductReviews.bind(controller));
router.post('/', authenticate, controller.createReview.bind(controller));

// Admin
router.get('/', authenticate, requireAdmin, controller.getAllReviews.bind(controller));
router.patch('/:id/approve', authenticate, requireAdmin, controller.approveReview.bind(controller));
router.delete('/:id', authenticate, requireAdmin, controller.deleteReview.bind(controller));

export default router;
