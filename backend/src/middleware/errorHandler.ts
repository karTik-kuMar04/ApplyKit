import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

// Express 5 types req.params values as string | string[] to account for
// repeating route segments (e.g. "/:id+"). None of our routes do that, so
// this narrows back to a plain string and throws clearly if that ever changes.
export function param(req: Request, name: string): string {
  const value = req.params[name];
  if (Array.isArray(value)) {
    throw new AppError(`Expected a single value for route param "${name}"`, 400);
  }
  return value;
}

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// Wraps async route handlers so thrown/rejected errors reach errorHandler
// instead of crashing the process or hanging the request.
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err instanceof AppError ? err.message : 'Internal server error';

  const reqLogger = req.log || logger;

  if (statusCode === 500) {
    reqLogger.error({ err }, 'Unhandled error');
  } else {
    reqLogger.warn({ err }, message);
  }

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { details: err.stack }),
  });
}
