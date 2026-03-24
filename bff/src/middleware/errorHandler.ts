import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../types/index.js";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response<ErrorResponse>,
  _next: NextFunction
) => {
  console.error("Error:", err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      code: err.code,
    });
  }

  // Handle pg errors
  if (err.name === "DatabaseError" || (err as any).code?.startsWith("23")) {
    return res.status(400).json({
      success: false,
      error: "Database error occurred",
      code: "DATABASE_ERROR",
    });
  }

  return res.status(500).json({
    success: false,
    error: "Internal server error",
    code: "INTERNAL_ERROR",
  });
};

export const notFoundHandler = (_req: Request, res: Response<ErrorResponse>) => {
  res.status(404).json({
    success: false,
    error: "Resource not found",
    code: "NOT_FOUND",
  });
};
