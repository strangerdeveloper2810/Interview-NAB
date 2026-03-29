import { Router } from 'express';
import type { Router as RouterType } from 'express';
import authRoutes from './authRoutes.js';
import accountRoutes from './accountRoutes.js';
import transferRoutes from './transferRoutes.js';
import userRoutes from './userRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import adminRoutes from './adminRoutes.js';

const router: RouterType = Router();

router.use('/auth', authRoutes);
router.use('/accounts', accountRoutes);
router.use('/transfers', transferRoutes);
router.use('/users', userRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/admin', adminRoutes);

export default router;
