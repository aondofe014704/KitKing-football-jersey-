import { Router } from 'express';
import { AdminController } from './admin.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requireAdmin } from '../../middleware/admin.middleware';

const router = Router();
const controller = new AdminController();

router.use(authenticate, requireAdmin);

router.get('/stats', controller.getDashboardStats.bind(controller));
router.get('/sales-chart', controller.getSalesChart.bind(controller));
router.get('/top-products', controller.getTopProducts.bind(controller));
router.get('/settings', controller.getSettings.bind(controller));
router.patch('/settings', controller.updateSettings.bind(controller));

export default router;
