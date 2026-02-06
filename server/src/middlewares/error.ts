import type { Request, Response, NextFunction } from "express";
import { envMode } from "../app.js";

interface CustomError extends Error {
  statusCode?: number;
  code?: number;
  keyPattern?: Record<string, number>;
  path?: string;
}

const errorMiddleware = (
  err: CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): Response => {
  err.message ||= "Internal Server Error";
  err.statusCode ||= 500;

  // Mongo duplicate key error
  if (err.code === 11000 && err.keyPattern) {
    const error = Object.keys(err.keyPattern).join(",");
    err.message = `Duplicate field value entered for ${error}`;
    err.statusCode = 400;
  }

  // Mongoose cast error
  if (err.name === "CastError" && err.path) {
    err.message = `Invalid format of ${err.path}`;
    err.statusCode = 400;
  }

  return res.status(err.statusCode).json({
    success: false,
    // message: envMode === "DEVELOPMENT" ? err : err.message,
    message: err.message,
  });
};

/* =======================
   TryCatch Wrapper
======================= */

type AsyncController = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<unknown>;

const TryCatch =
  (passedFunc: AsyncController) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await passedFunc(req, res, next);
    } catch (error) {
      next(error);
    }
  };

export { errorMiddleware, TryCatch };
