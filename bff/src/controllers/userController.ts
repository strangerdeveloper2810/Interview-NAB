import { Response, NextFunction } from "express";
import { userService } from "../services/userService.js";
import { AppError } from "../middleware/errorHandler.js";
import { AuthRequest, SuccessResponse } from "../types/index.js";

export const userController = {
  /**
   * GET /api/users/me
   * Get current authenticated user
   */
  async getMe(
    req: AuthRequest,
    res: Response<SuccessResponse>,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.userId;

      if (userId === undefined) {
        throw new AppError(401, "User not authenticated");
      }

      const user = await userService.getUserById(userId);

      res.json({
        success: true,
        data: user,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * PATCH /api/users/me
   * Update current user's name
   */
  async updateMe(
    req: AuthRequest,
    res: Response<SuccessResponse>,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.userId;

      if (userId === undefined) {
        throw new AppError(401, "User not authenticated");
      }

      const { name } = req.body;

      if (!name || typeof name !== "string" || name.trim().length === 0) {
        throw new AppError(400, "Name is required and must be a non-empty string");
      }

      const user = await userService.updateUserName(userId, name.trim());

      res.json({
        success: true,
        data: user,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * PUT /api/users/password
   * Change current user's password
   */
  async changePassword(
    req: AuthRequest,
    res: Response<SuccessResponse>,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.userId;

      if (userId === undefined) {
        throw new AppError(401, "User not authenticated");
      }

      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || typeof currentPassword !== "string") {
        throw new AppError(400, "Current password is required");
      }

      if (!newPassword || typeof newPassword !== "string") {
        throw new AppError(400, "New password is required");
      }

      await userService.changePassword(userId, currentPassword, newPassword);

      res.json({
        success: true,
        data: { message: "Password updated successfully" },
      });
    } catch (err) {
      next(err);
    }
  },
};
