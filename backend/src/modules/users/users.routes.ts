import { Router } from 'express';
import { UsersController } from './users.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requireAdmin } from '../../middleware/admin.middleware';

const router = Router();
const controller = new UsersController();

// Admin routes
router.get('/', authenticate, requireAdmin, controller.getAllUsers.bind(controller));
router.get('/:id', authenticate, requireAdmin, controller.getUserById.bind(controller));
router.patch('/:id/toggle-status', authenticate, requireAdmin, controller.toggleUserStatus.bind(controller));

// Customer routes
router.patch('/profile', authenticate, controller.updateProfile.bind(controller));
router.post('/addresses', authenticate, controller.addAddress.bind(controller));
router.patch('/addresses/:id', authenticate, controller.updateAddress.bind(controller));
router.delete('/addresses/:id', authenticate, controller.deleteAddress.bind(controller));

export default router;
