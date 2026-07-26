import { Router } from 'express';
import { OrdersController } from './orders.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requireAdmin } from '../../middleware/admin.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createOrderSchema, updateOrderStatusSchema } from './orders.schema';

const router = Router();
const controller = new OrdersController();

// Public
router.get('/track/:orderNumber', controller.trackOrder.bind(controller));

// Customer
router.post('/', authenticate, validate(createOrderSchema), controller.createOrder.bind(controller));
router.get('/my', authenticate, controller.getMyOrders.bind(controller));
router.get('/my/:id', authenticate, controller.getMyOrderById.bind(controller));
router.patch('/my/:id/cancel', authenticate, controller.cancelOrder.bind(controller));

// Admin
router.get('/', authenticate, requireAdmin, controller.getAllOrders.bind(controller));
router.get('/:id', authenticate, requireAdmin, controller.getOrderById.bind(controller));
router.patch('/:id/status', authenticate, requireAdmin, validate(updateOrderStatusSchema), controller.updateOrderStatus.bind(controller));

export default router;
