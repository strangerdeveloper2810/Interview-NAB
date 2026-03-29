import { Router } from "express";
import type { Router as RouterType } from "express";
import { userController } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validation.js";
import { updateNameSchema } from "../schemas/index.js";

const router: RouterType = Router();

// All user routes require authentication
router.use(authMiddleware);

router.get("/me", userController.getMe);
router.patch("/me", validate(updateNameSchema), userController.updateMe);
router.put("/password", userController.changePassword);

export default router;
