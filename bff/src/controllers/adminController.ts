import { Response, NextFunction } from "express";
import { adminService } from "../services/adminService.js";
import { AppError } from "../middleware/errorHandler.js";
import { AuthRequest, SuccessResponse } from "../types/index.js";

export const adminController = {
  /**
   * GET /api/admin/users
   * List all users (admin only)
   */
  async getUsers(
    req: AuthRequest,
    res: Response<SuccessResponse>,
    next: NextFunction
  ) {
    try {
      const users = await adminService.getAllUsers();

      res.json({
        success: true,
        data: users,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/admin/users/:id/accounts
   * Get all accounts for a specific user (admin only)
   */
  async getUserAccounts(
    req: AuthRequest,
    res: Response<SuccessResponse>,
    next: NextFunction
  ) {
    try {
      const userId = parseInt(req.params.id, 10);

      if (isNaN(userId)) {
        throw new AppError(400, "Invalid user ID");
      }

      const accounts = await adminService.getUserAccounts(userId);

      res.json({
        success: true,
        data: accounts,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/admin/transactions
   * Get all transactions across all users (admin audit)
   */
  async getAllTransactions(
    req: AuthRequest,
    res: Response<SuccessResponse>,
    next: NextFunction
  ) {
    try {
      const limit = parseInt(req.query.limit as string, 10) || 50;
      const offset = parseInt(req.query.offset as string, 10) || 0;

      const result = await adminService.getAllTransactions(limit, offset);

      res.json({
        success: true,
        data: {
          transactions: result.transactions,
          pagination: {
            total: result.total,
            limit,
            offset,
            hasMore: offset + result.transactions.length < result.total,
          },
        },
      });
    } catch (err) {
      next(err);
    }
  },
};
