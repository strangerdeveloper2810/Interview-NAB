import { Router } from "express";
import type { Router as RouterType } from "express";
import { transferController } from "../controllers/transferController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validation.js";
import { transferSchema } from "../schemas/index.js";

const router: RouterType = Router();

// All transfer routes require authentication
router.use(authMiddleware);

router.post("/", validate(transferSchema), transferController.transfer);

export default router;
