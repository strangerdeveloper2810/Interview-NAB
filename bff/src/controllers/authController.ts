import { Request, Response, NextFunction } from "express";
import { authService } from "../services/authService.js";
import { AppError } from "../middleware/errorHandler.js";
import { LoginRequest, RegisterRequest, SuccessResponse } from "../types/index.js";

interface RefreshTokenRequest {
  refreshToken: string;
}

export const authController = {
  /**
   * POST /api/auth/login
   */
  async login(
    req: Request<unknown, unknown, LoginRequest>,
    res: Response<SuccessResponse>,
    next: NextFunction
  ) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new AppError(400, "Email and password are required");
      }

      const result = await authService.login(email, password);

      res.json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/auth/register
   */
  async register(
    req: Request<unknown, unknown, RegisterRequest>,
    res: Response<SuccessResponse>,
    next: NextFunction
  ) {
    try {
      const { email, name, password } = req.body;

      if (!email || !name || !password) {
        throw new AppError(400, "Email, name and password are required");
      }

      const result = await authService.register(email, password, name);

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/auth/refresh
   * Get new access token using refresh token
   */
  async refreshToken(
    req: Request<unknown, unknown, RefreshTokenRequest>,
    res: Response<SuccessResponse>,
    next: NextFunction
  ) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        throw new AppError(400, "Refresh token is required");
      }

      const tokens = authService.refreshTokens(refreshToken);

      res.json({
        success: true,
        data: { tokens },
      });
    } catch (err) {
      next(err);
    }
  },
};
