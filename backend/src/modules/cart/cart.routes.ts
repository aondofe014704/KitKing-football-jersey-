import { Router } from 'express';
import { CartController } from './cart.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();
const controller = new CartController();

router.use(authenticate);

router.get('/', controller.getCart.bind(controller));
router.post('/', controller.addToCart.bind(controller));
router.patch('/:id', controller.updateCartItem.bind(controller));
router.delete('/:id', controller.removeFromCart.bind(controller));
router.delete('/', controller.clearCart.bind(controller));

export default router;
