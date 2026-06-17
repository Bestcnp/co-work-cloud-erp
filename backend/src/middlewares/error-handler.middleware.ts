/**
 * Global Error Handler Middleware
 *
 * Catches all errors that bubble up through Express's middleware chain and
 * returns a consistent JSON error response.  Must be registered as the
 * **last** middleware in the app (after all routes).
 *
 * Recognised error types:
 *   1. {@link AppError}  — application-level errors with a status code.
 *   2. {@link ZodError}  — schema validation failures (safety net in case
 *      they bypass the validate middleware).
 *   3. Everything else   — treated as an unexpected 500 Internal Error.
 *      In production the original message is hidden from the client.
 */

import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/app-error.js';
import { logger } from '../lib/logger.js';

/** Shape of every error response body. */
interface ErrorResponseBody {
  error: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Express error-handling middleware (4-param signature).
 *
 * Register with: `app.use(errorHandler);`
 */
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const timestamp = new Date().toISOString();

  // ── 1. Known application errors ────────────────────────────────────────
  if (err instanceof AppError) {
    logger.warn(err.message, {
      code: err.code,
      statusCode: err.statusCode,
      path: req.originalUrl,
      method: req.method,
      ...(err.details ? { details: err.details } : {}),
    });

    const body: ErrorResponseBody = {
      error: err.code,
      message: err.message,
      timestamp,
      ...(err.details ? { details: err.details } : {}),
    };

    res.status(err.statusCode).json(body);
    return;
  }

  // ── 2. Zod validation errors (safety net) ──────────────────────────────
  if (err instanceof ZodError) {
    const details: Record<string, unknown> = {
      issues: err.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    };

    logger.warn('Validation error (ZodError)', {
      path: req.originalUrl,
      method: req.method,
      details,
    });

    const body: ErrorResponseBody = {
      error: 'VALIDATION_ERROR',
      message: 'Request validation failed',
      details,
      timestamp,
    };

    res.status(400).json(body);
    return;
  }

  // ── 3. Unexpected / unknown errors ─────────────────────────────────────
  const error = err instanceof Error ? err : new Error(String(err));

  logger.error('Unhandled error', {
    message: error.message,
    stack: error.stack,
    path: req.originalUrl,
    method: req.method,
  });

  const body: ErrorResponseBody = {
    error: 'INTERNAL_ERROR',
    message: isProduction
      ? 'An unexpected error occurred'
      : error.message,
    timestamp,
  };

  res.status(500).json(body);
}
