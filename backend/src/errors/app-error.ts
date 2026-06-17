/**
 * Application Error Hierarchy
 *
 * Typed error classes that carry an HTTP status code and a machine-readable
 * {@link ErrorCode}.  The global error-handler middleware translates these
 * into structured JSON responses.
 *
 * Usage:
 *   throw new NotFoundError('Project', projectId);
 *   throw new ValidationError('Email is required', { field: 'email' });
 */

import type { ErrorCode } from './error-codes.js';

// ────────────────────────────────────────────────────────────────────────────
// Base class
// ────────────────────────────────────────────────────────────────────────────

/**
 * Base application error.
 *
 * All domain-level errors should extend this class so that the error-handler
 * middleware can distinguish expected errors from unexpected ones.
 */
export class AppError extends Error {
  /** Machine-readable error code returned in JSON responses. */
  public readonly code: ErrorCode;

  /** HTTP status code to send to the client. */
  public readonly statusCode: number;

  /** Optional structured details attached to the error response. */
  public readonly details?: Record<string, unknown>;

  constructor(
    code: ErrorCode,
    statusCode: number,
    message: string,
    details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;

    // Maintain proper prototype chain for instanceof checks.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Convenience sub-classes
// ────────────────────────────────────────────────────────────────────────────

/** 404 — the requested resource does not exist. */
export class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super('NOT_FOUND', 404, `${resource} with id "${id}" not found`);
  }
}

/** 400 — request body / query failed validation. */
export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super('VALIDATION_ERROR', 400, message, details);
  }
}

/** 403 — authenticated but lacks permission. */
export class ForbiddenError extends AppError {
  constructor(message = 'You do not have permission to perform this action') {
    super('FORBIDDEN', 403, message);
  }
}

/** 401 — missing or invalid credentials. */
export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication is required') {
    super('UNAUTHORIZED', 401, message);
  }
}

/** 409 — resource state conflict (e.g. duplicate creation). */
export class ConflictError extends AppError {
  constructor(message: string) {
    super('CONFLICT', 409, message);
  }
}

/** 400 — generic bad request that is not a validation issue. */
export class BadRequestError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super('BAD_REQUEST', 400, message, details);
  }
}
