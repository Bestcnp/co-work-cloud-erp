/**
 * Common Zod Schemas
 *
 * Reusable schema fragments shared across multiple route schemas.
 * Schemas follow the `{ body, params, query }` envelope convention so
 * they plug directly into the validation middleware.
 */

import { z } from 'zod';

// ────────────────────────────────────────────────────────────────────────────
// Query schemas
// ────────────────────────────────────────────────────────────────────────────

/**
 * Standard pagination query-string schema.
 *
 * `z.coerce.number()` transparently converts the string value from
 * `req.query` into a number.
 */
export const paginationQuery = z.object({
  limit: z.coerce.number().min(1).max(100).default(20),
  cursor: z.string().optional(),
  direction: z.enum(['next', 'prev']).default('next'),
});

// ────────────────────────────────────────────────────────────────────────────
// Param schemas
// ────────────────────────────────────────────────────────────────────────────

/**
 * Validate that `req.params.tenantId` is present and non-empty.
 */
export const tenantIdParam = z.object({
  params: z.object({
    tenantId: z.string().min(1),
  }),
});

/**
 * Factory that creates a param schema requiring a single named ID.
 *
 * @example
 *   const projectIdParam = idParam('projectId');
 *   // validates { params: { projectId: string } }
 */
export function idParam(name: string) {
  return z.object({
    params: z.object({
      [name]: z.string().min(1),
    }),
  });
}
