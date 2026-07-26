import { Router } from 'express';
import { CouponsController } from './coupons.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requireAdmin } from '../../middleware/admin.middleware';

const router = Router();
const controller = new CouponsController();

router.post('/validate', controller.validateCoupon.bind(controller));

// Admin
router.get('/', authenticate, requireAdmin, controller.getAllCoupons.bind(controller));
router.post('/', authenticate, requireAdmin, controller.createCoupon.bind(controller));
router.patch('/:id', authenticate, requireAdmin, controller.updateCoupon.bind(controller));
router.delete('/:id', authenticate, requireAdmin, controller.deleteCoupon.bind(controller));

export default router;
