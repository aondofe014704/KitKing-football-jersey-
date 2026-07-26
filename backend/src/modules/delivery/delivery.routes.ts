import { Router } from 'express';
import { DeliveryController } from './delivery.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requireAdmin } from '../../middleware/admin.middleware';

const router = Router();
const controller = new DeliveryController();

router.get('/', controller.getAllZones.bind(controller));
router.get('/state/:state', controller.getZoneByState.bind(controller));

// Admin
router.get('/admin/all', authenticate, requireAdmin, controller.getAllZonesAdmin.bind(controller));
router.post('/', authenticate, requireAdmin, controller.createZone.bind(controller));
router.patch('/:id', authenticate, requireAdmin, controller.updateZone.bind(controller));
router.delete('/:id', authenticate, requireAdmin, controller.deleteZone.bind(controller));

export default router;
