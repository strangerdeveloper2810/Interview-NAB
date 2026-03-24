import { Response, NextFunction } from "express";
import { accountService } from "../services/accountService.js";
import { AppError } from "../middleware/errorHandler.js";
import { AuthRequest, SuccessResponse } from "../types/index.js";

export const accountController = {
  /**
   * GET /api/accounts
   * Get all accounts for authenticated user
   */
  async getAccounts(
    req: AuthRequest,
    res: Response<SuccessResponse>,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.userId;

      if (userId === undefined) {
        throw new AppError(401, "User not authenticated");
      }

      const accounts = await accountService.getAccountsByUserId(userId);

      res.json({
        success: true,
        data: accounts,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/accounts/:id
   * Get account by ID
   */
  async getAccountById(
    req: AuthRequest,
    res: Response<SuccessResponse>,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.userId;
      const accountId = parseInt(req.params.id, 10);

      if (userId === undefined) {
        throw new AppError(401, "User not authenticated");
      }

      if (isNaN(accountId)) {
        throw new AppError(400, "Invalid account ID");
      }

      const account = await accountService.getAccountById(accountId, userId);

      res.json({
        success: true,
        data: account,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/accounts/:id/transactions
   * Get transactions for an account
   */
  async getAccountTransactions(
    req: AuthRequest,
    res: Response<SuccessResponse>,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.userId;
      const accountId = parseInt(req.params.id, 10);
      const limit = parseInt(req.query.limit as string, 10) || 50;
      const offset = parseInt(req.query.offset as string, 10) || 0;

      if (userId === undefined) {
        throw new AppError(401, "User not authenticated");
      }

      if (isNaN(accountId)) {
        throw new AppError(400, "Invalid account ID");
      }

      const { transactions, total } =
        await accountService.getTransactionsByAccountId(
          accountId,
          userId,
          limit,
          offset
        );

      res.json({
        success: true,
        data: {
          transactions,
          pagination: {
            total,
            limit,
            offset,
            hasMore: offset + transactions.length < total,
          },
        },
      });
    } catch (err) {
      next(err);
    }
  },
};
