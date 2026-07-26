import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validate } from '../../middleware/validate.middleware';
import { authenticate } from '../../middleware/auth.middleware';
import { authLimiter } from '../../middleware/rateLimit.middleware';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  changePasswordSchema,
} from './auth.schema';

const router = Router();
const controller = new AuthController();

router.post('/register', authLimiter, validate(registerSchema), controller.register.bind(controller));
router.post('/login', authLimiter, validate(loginSchema), controller.login.bind(controller));
router.post('/refresh', validate(refreshTokenSchema), controller.refreshToken.bind(controller));
router.post('/logout', authenticate, controller.logout.bind(controller));
router.get('/me', authenticate, controller.getMe.bind(controller));
router.patch('/change-password', authenticate, validate(changePasswordSchema), controller.changePassword.bind(controller));

export default router;
