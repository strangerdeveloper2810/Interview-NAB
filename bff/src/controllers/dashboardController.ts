import { Response, NextFunction } from "express";
import { dashboardService } from "../services/dashboardService.js";
import { AppError } from "../middleware/errorHandler.js";
import { AuthRequest, SuccessResponse } from "../types/index.js";

export const dashboardController = {
  /**
   * GET /api/dashboard
   * Get dashboard summary for authenticated user
   */
  async getDashboard(
    req: AuthRequest,
    res: Response<SuccessResponse>,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.userId;

      if (userId === undefined) {
        throw new AppError(401, "User not authenticated");
      }

      const dashboardData = await dashboardService.getDashboardData(userId);

      res.json({
        success: true,
        data: dashboardData,
      });
    } catch (err) {
      next(err);
    }
  },
};
