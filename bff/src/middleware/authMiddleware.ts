import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/index.js";
import { AppError } from "./errorHandler.js";
import { jwtUtils } from "../utils/jwt.js";

export const authMiddleware = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError(401, "No token provided");
    }

    const token = authHeader.split(" ")[1];
    const payload = jwtUtils.verifyAccessToken(token);

    req.user = payload;
    next();
  } catch (err) {
    if (err instanceof AppError) {
      next(err);
      return;
    }
    next(new AppError(500, "Authentication failed"));
  }
};

/**
 * Role-based authorization middleware
 * Usage: requireRole('admin') or requireRole('user', 'admin')
 */
export const requireRole = (...roles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError(401, "Authentication required"));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError(403, "Insufficient permissions"));
    }

    next();
  };
};
