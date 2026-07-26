import { Router } from 'express';
import { WishlistController } from './wishlist.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();
const controller = new WishlistController();

router.use(authenticate);

router.get('/', controller.getWishlist.bind(controller));
router.post('/:productId/toggle', controller.toggleWishlist.bind(controller));
router.delete('/:productId', controller.removeFromWishlist.bind(controller));

export default router;
