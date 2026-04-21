import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  const isAppError = err instanceof AppError;
  const statusCode = isAppError ? err.statusCode : 500;

  if (!isAppError) {
    console.error("Unhandled error:", err);
  }

  res.status(statusCode).json({
    error: {
      message: isAppError ? err.message : "Internal server error",
      ...(env.NODE_ENV === "development" && !isAppError && { stack: err.stack }),
    },
  });
}
