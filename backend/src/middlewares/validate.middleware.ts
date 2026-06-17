/**
 * Zod Validation Middleware
 *
 * Generic Express middleware that validates the incoming request against
 * a Zod schema.  Schemas are expected to describe an object with optional
 * `body`, `params`, and `query` keys so that a single schema can validate
 * all three sources at once.
 *
 * Usage:
 *   import { validate } from '../middlewares/validate.middleware.js';
 *   import { createTenantSchema } from '../schemas/tenant.schema.js';
 *
 *   router.post('/tenants', validate(createTenantSchema), handler);
 */

import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';
import { ZodError } from 'zod';
import { ValidationError } from '../errors/app-error.js';

/**
 * Return Express middleware that validates `req.body`, `req.params`, and
 * `req.query` against the supplied Zod schema.
 *
 * On success the parsed (and potentially coerced / defaulted) values are
 * written back onto `req` so downstream handlers receive clean data.
 *
 * On failure a {@link ValidationError} is thrown with structured details
 * listing every validation issue.
 */
export function validate(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const result = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      }) as { body?: unknown; params?: unknown; query?: unknown };

      // Write parsed values back so handlers see coerced / defaulted data.
      if (result.body)   req.body   = result.body as typeof req.body;
      if (result.params) req.params = result.params as typeof req.params;
      if (result.query)  req.query  = result.query as typeof req.query;

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const details: Record<string, unknown> = {
          issues: err.issues.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message,
          })),
        };

        throw new ValidationError('Request validation failed', details);
      }

      // Re-throw unexpected errors for the global error handler.
      throw err;
    }
  };
}
