import { Response, NextFunction } from "express";
import { accountService } from "../services/accountService.js";
import { AppError } from "../middleware/errorHandler.js";
import { AuthRequest, SuccessResponse, TransferRequest } from "../types/index.js";

export const transferController = {
  /**
   * POST /api/transfers
   * Transfer money between accounts
   */
  async transfer(
    req: AuthRequest,
    res: Response<SuccessResponse>,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.userId;

      if (userId === undefined) {
        throw new AppError(401, "User not authenticated");
      }

      const { fromAccountId, toAccountId, amount, description } =
        req.body as TransferRequest;

      if (!fromAccountId || !toAccountId || !amount) {
        throw new AppError(
          400,
          "fromAccountId, toAccountId and amount are required"
        );
      }

      if (typeof amount !== "number" || amount <= 0) {
        throw new AppError(400, "Amount must be a positive number");
      }

      if (fromAccountId === toAccountId) {
        throw new AppError(400, "Cannot transfer to the same account");
      }

      const result = await accountService.transfer(
        fromAccountId,
        toAccountId,
        amount,
        userId,
        description
      );

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },
};
