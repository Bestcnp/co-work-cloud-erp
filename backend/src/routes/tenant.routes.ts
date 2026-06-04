/**
 * Tenant Routes
 *
 * Handles tenant CRUD, user management, and settings.
 * All routes require authentication. Tenant-specific routes
 * also enforce tenant access and granular permissions.
 */

import { Router } from 'express';
import {
  requireAuth,
  requireTenantAccess,
  requirePermission,
} from '../middlewares/auth.middleware.js';
import {
  createTenant,
  getTenant,
  inviteUser,
  acceptInvitation,
  removeUser,
  updateTenantSettings,
} from '../controllers/tenant.controller.js';

const router = Router();

// Create a new tenant — any authenticated user
router.post('/', requireAuth, createTenant);

// Get tenant details — must be a member
router.get('/:tenantId', requireAuth, requireTenantAccess, getTenant);

// Invite a user — must have can_manage_users permission
router.post(
  '/:tenantId/invite',
  requireAuth,
  requireTenantAccess,
  requirePermission('can_manage_users'),
  inviteUser,
);

// Accept an invitation — any authenticated user with a valid invitation
router.post('/:tenantId/accept-invitation', requireAuth, acceptInvitation);

// Remove a user — must have can_manage_users permission
router.delete(
  '/:tenantId/users/:userId',
  requireAuth,
  requireTenantAccess,
  requirePermission('can_manage_users'),
  removeUser,
);

// Update tenant settings — must have can_manage_settings permission
router.put(
  '/:tenantId/settings',
  requireAuth,
  requireTenantAccess,
  requirePermission('can_manage_settings'),
  updateTenantSettings,
);

export default router;
