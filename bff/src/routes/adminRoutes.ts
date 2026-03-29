import { Router } from "express";
import type { Router as RouterType } from "express";
import { adminController } from "../controllers/adminController.js";
import { authMiddleware, requireRole } from "../middleware/authMiddleware.js";

const router: RouterType = Router();

// All admin routes require auth + admin role
router.use(authMiddleware, requireRole("admin"));

router.get("/users", adminController.getUsers);
router.get("/users/:id/accounts", adminController.getUserAccounts);
router.get("/transactions", adminController.getAllTransactions);

export default router;
