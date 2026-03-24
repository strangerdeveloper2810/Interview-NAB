import { Router } from "express";
import type { Router as RouterType } from "express";
import { transferController } from "../controllers/transferController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router: RouterType = Router();

// All transfer routes require authentication
router.use(authMiddleware);

router.post("/", transferController.transfer);

export default router;
