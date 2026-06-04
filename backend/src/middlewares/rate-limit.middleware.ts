/**
 * Rate Limiting Middleware
 *
 * Provides three tiers of rate limiting:
 * - globalRateLimit: General API protection (500 req / 15 min per IP)
 * - authRateLimit: Stricter limit for auth endpoints (20 req / 15 min per IP)
 * - writeRateLimit: Limit for write operations (60 req / 1 min per IP)
 */

import rateLimit from 'express-rate-limit';

/**
 * Global rate limit — applied to all routes.
 * 500 requests per 15-minute window per IP.
 */
export const globalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'RATE_LIMITED',
    message: 'Too many requests. Please try again later.',
  },
});

/**
 * Auth rate limit — applied to authentication endpoints.
 * 20 requests per 15-minute window per IP.
 */
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'RATE_LIMITED',
    message: 'Too many authentication attempts.',
  },
});

/**
 * Write rate limit — applied to POST/PUT/PATCH/DELETE routes.
 * 60 requests per 1-minute window per IP.
 */
export const writeRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'RATE_LIMITED',
    message: 'Too many write operations.',
  },
});
