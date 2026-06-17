/**
 * Auth Zod Schemas
 *
 * Request validation schemas for authentication and user-profile endpoints.
 * Each schema wraps its fields inside a `body` key so the validation
 * middleware can parse `{ body: req.body, params: req.params, query: req.query }`
 * in one shot.
 */

import { z } from 'zod';

/**
 * POST /auth/register
 */
export const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    displayName: z.string().min(1).max(100),
    password: z.string().min(8),
  }),
});

/**
 * PATCH /auth/profile
 */
export const updateProfileSchema = z.object({
  body: z.object({
    displayName: z.string().min(1).max(100).optional(),
    photoUrl: z.string().url().nullable().optional(),
  }),
});

/**
 * POST /auth/switch-tenant
 */
export const switchTenantSchema = z.object({
  body: z.object({
    tenantId: z.string().min(1),
  }),
});
