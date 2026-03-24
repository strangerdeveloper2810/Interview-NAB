import { Router } from 'express';
import type { Router as RouterType } from 'express';
import { accountController } from '../controllers/accountController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router: RouterType = Router();

// All account routes require authentication
router.use(authMiddleware);

router.get('/', accountController.getAccounts);
router.get('/:id', accountController.getAccountById);
router.get('/:id/transactions', accountController.getAccountTransactions);

export default router;
