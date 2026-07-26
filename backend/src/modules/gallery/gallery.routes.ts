import { Router } from 'express';
import { GalleryController } from './gallery.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requireAdmin } from '../../middleware/admin.middleware';

const router = Router();
const controller = new GalleryController();

router.get('/', controller.getAllImages.bind(controller));

// Admin
router.get('/admin', authenticate, requireAdmin, controller.getAllImagesAdmin.bind(controller));
router.post('/', authenticate, requireAdmin, controller.addImage.bind(controller));
router.patch('/reorder', authenticate, requireAdmin, controller.reorderImages.bind(controller));
router.patch('/:id', authenticate, requireAdmin, controller.updateImage.bind(controller));
router.delete('/:id', authenticate, requireAdmin, controller.deleteImage.bind(controller));

export default router;
