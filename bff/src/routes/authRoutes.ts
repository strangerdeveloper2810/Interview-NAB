import { Router } from 'express';
import type { Router as RouterType } from 'express';
import { authController } from '../controllers/authController.js';

const router: RouterType = Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/refresh', authController.refreshToken);

export default router;
