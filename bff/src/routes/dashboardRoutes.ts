import { Router } from "express";
import type { Router as RouterType } from "express";
import { dashboardController } from "../controllers/dashboardController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router: RouterType = Router();

// All dashboard routes require authentication
router.use(authMiddleware);

router.get("/", dashboardController.getDashboard);

export default router;
