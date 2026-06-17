/**
 * Error Codes
 *
 * Centralised string-literal union of every error code the application may
 * return to clients. Using a union (rather than an enum) keeps the type fully
 * erasable at runtime while still giving compile-time safety.
 */

export type ErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'BAD_REQUEST'
  | 'VALIDATION_ERROR'
  | 'CONFLICT'
  | 'INTERNAL_ERROR'
  | 'SERVICE_UNAVAILABLE'
  | 'RATE_LIMITED'
  | 'TENANT_FROZEN'
  | 'PERMISSION_DENIED';
