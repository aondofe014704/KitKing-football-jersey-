import { Router } from 'express';
import { PaymentsController } from './payments.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();
const controller = new PaymentsController();

router.use(authenticate);

router.post('/paystack/initialize/:orderId', controller.initializePaystack.bind(controller));
router.get('/paystack/verify/:reference', controller.verifyPaystack.bind(controller));
router.post('/flutterwave/initialize/:orderId', controller.initializeFlutterwave.bind(controller));
router.get('/status/:orderId', controller.getPaymentStatus.bind(controller));

export default router;
