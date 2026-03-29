import { Router } from 'express';
import type { Router as RouterType } from 'express';
import { authController } from '../controllers/authController.js';
import { validate } from '../middleware/validation.js';
import { loginSchema, registerSchema } from '../schemas/index.js';

const router: RouterType = Router();

router.post('/login', validate(loginSchema), authController.login);
router.post('/register', validate(registerSchema), authController.register);
router.post('/refresh', authController.refreshToken);

export default router;
