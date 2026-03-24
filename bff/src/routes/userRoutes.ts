import { Router } from "express";
import type { Router as RouterType } from "express";
import { userController } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router: RouterType = Router();

// All user routes require authentication
router.use(authMiddleware);

router.get("/me", userController.getMe);
router.patch("/me", userController.updateMe);

export default router;
