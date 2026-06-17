/**
 * Tenant Zod Schemas
 *
 * Request validation schemas for tenant management endpoints — creation,
 * user invitations, and settings updates.
 */

import { z } from 'zod';

/**
 * POST /tenants
 */
export const createTenantSchema = z.object({
  body: z.object({
    companyNameTH: z.string().min(1).max(200),
    companyNameEN: z.string().min(1).max(200),
    vatId: z.string().regex(/^\d{13}$/, 'Thai VAT ID must be 13 digits'),
    dbdRegistrationNumber: z.string().optional(),
  }),
});

/**
 * POST /tenants/:tenantId/invitations
 */
export const inviteUserSchema = z.object({
  body: z.object({
    email: z.string().email(),
    role: z.string().min(1),
  }),
});

/**
 * PATCH /tenants/:tenantId/settings
 *
 * All fields are optional so the client can send a partial update.
 */
export const updateSettingsSchema = z.object({
  body: z.object({
    /** Primary locale for the tenant UI (e.g. "th", "en"). */
    locale: z.enum(['th', 'en']).optional(),
    /** IANA timezone identifier. */
    timezone: z.string().min(1).optional(),
    /** ISO 4217 currency code. */
    currency: z.string().length(3).optional(),
    /** Fiscal year start month (1 = January … 12 = December). */
    fiscalYearStartMonth: z.coerce.number().int().min(1).max(12).optional(),
    /** Custom logo URL. */
    logoUrl: z.string().url().nullable().optional(),
    /** Whether the tenant is currently active. */
    isActive: z.boolean().optional(),
  }),
});
