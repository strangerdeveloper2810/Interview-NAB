import { Request, Response, NextFunction } from "express";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();

  // Log request
  console.log(`→ ${req.method} ${req.path}`);

  // Log response when finished
  res.on("finish", () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const statusColor =
      status >= 500 ? "\x1b[31m" : status >= 400 ? "\x1b[33m" : "\x1b[32m";

    console.log(
      `← ${statusColor}${status}\x1b[0m ${req.method} ${req.path} ${duration}ms`
    );
  });

  next();
};
