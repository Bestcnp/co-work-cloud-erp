/**
 * Tenant Controller
 *
 * Handles tenant creation, user management (invite/accept/remove),
 * and tenant settings updates for the multi-company system.
 */

import type { Request, Response } from 'express';
import { db, setTenantCustomClaims } from '../config/firebase.js';
import type {
  TenantConfig,
  GlobalUserProfile,
  TenantMembership,
  GpsTrackingMode,
} from '../models/index.js';

// Default limits for STARTER tier
const STARTER_DEFAULTS = {
  maxUsers: 10,
  maxProducts: 100,
  storageQuotaBytes: 1_073_741_824, // 1 GB
} as const;

// ============================================================
// POST /tenants
// ============================================================

interface CreateTenantBody {
  companyNameTH: string;
  companyNameEN: string;
  vatId: string;
  dbdRegistrationNumber?: string;
}

export async function createTenant(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'UNAUTHORIZED',
        message: 'Authentication required.',
      });
      return;
    }

    const {
      companyNameTH,
      companyNameEN,
      vatId,
      dbdRegistrationNumber,
    } = req.body as CreateTenantBody;

    if (!companyNameTH || !companyNameEN || !vatId) {
      res.status(400).json({
        error: 'BAD_REQUEST',
        message: 'companyNameTH, companyNameEN, and vatId are required.',
      });
      return;
    }

    const now = new Date().toISOString();
    const tenantId = db.collection('tenants').doc().id;

    // Create TenantConfig document
    const tenantConfig: TenantConfig = {
      tenantId,
      companyNameTH,
      companyNameEN,
      vatId,
      dbdRegistrationNumber: dbdRegistrationNumber || null,
      subscriptionTier: 'STARTER',
      subscriptionExpiresAt: null,
      verificationStatus: 'PENDING',
      isEmergencyFrozen: false,
      gpsTrackingMode: 'DISABLED',
      activeAddons: [],
      maxUsers: STARTER_DEFAULTS.maxUsers,
      maxProducts: STARTER_DEFAULTS.maxProducts,
      storageQuotaBytes: STARTER_DEFAULTS.storageQuotaBytes,
      createdBy: req.user.uid,
      createdAt: now,
      updatedAt: now,
    };

    // Use batch for atomic writes
    const batch = db.batch();

    // 1. Create tenant document
    const tenantRef = db.collection('tenants').doc(tenantId);
    batch.set(tenantRef, tenantConfig);

    // 2. Add creator as ADMIN in tenant's users subcollection
    const tenantUserRef = tenantRef.collection('users').doc(req.user.uid);
    batch.set(tenantUserRef, {
      userId: req.user.uid,
      tenantId,
      assignedRole: 'ADMIN',
      permissions: ['*'],
      email: req.user.email,
      fullName: '',
      isKycVerified: false,
      isDeveloper: false,
      joinedAt: now,
      createdAt: now,
    });

    // 3. Update creator's GlobalUserProfile with new membership
    const userRef = db.collection('users').doc(req.user.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      res.status(404).json({
        error: 'NOT_FOUND',
        message: 'User profile not found. Please register first.',
      });
      return;
    }

    const userProfile = userDoc.data() as GlobalUserProfile;
    const newMembership: TenantMembership = {
      tenantId,
      role: 'ADMIN',
      permissions: ['*'],
      joinedAt: now,
    };

    batch.update(userRef, {
      tenantMemberships: [...userProfile.tenantMemberships, newMembership],
      activeTenantId: userProfile.activeTenantId || tenantId,
      updatedAt: now,
    });

    await batch.commit();

    // Set custom claims for the creator if this is their first tenant
    if (!userProfile.activeTenantId) {
      await setTenantCustomClaims(req.user.uid, tenantId, {
        role: 'ADMIN',
        permissions: ['*'],
      });
    }

    res.status(201).json({
      success: true,
      data: tenantConfig,
    });
  } catch (error) {
    console.error('[Tenant] Creation failed:', error);
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Failed to create tenant.',
    });
  }
}

// ============================================================
// GET /tenants/:tenantId
// ============================================================

export async function getTenant(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { tenantId } = req.params;

    const tenantDoc = await db.collection('tenants').doc(tenantId).get();
    if (!tenantDoc.exists) {
      res.status(404).json({
        error: 'NOT_FOUND',
        message: 'Tenant not found.',
      });
      return;
    }

    const tenantConfig = tenantDoc.data() as TenantConfig;

    res.json({
      success: true,
      data: tenantConfig,
    });
  } catch (error) {
    console.error('[Tenant] Fetch failed:', error);
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Failed to fetch tenant.',
    });
  }
}

// ============================================================
// POST /tenants/:tenantId/invite
// ============================================================

interface InviteUserBody {
  email: string;
  role: string;
  permissions: string[];
}

export async function inviteUser(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'UNAUTHORIZED',
        message: 'Authentication required.',
      });
      return;
    }

    const { tenantId } = req.params;
    const { email, role, permissions } = req.body as InviteUserBody;

    if (!email || !role) {
      res.status(400).json({
        error: 'BAD_REQUEST',
        message: 'email and role are required.',
      });
      return;
    }

    // Check tenant exists
    const tenantDoc = await db.collection('tenants').doc(tenantId).get();
    if (!tenantDoc.exists) {
      res.status(404).json({
        error: 'NOT_FOUND',
        message: 'Tenant not found.',
      });
      return;
    }

    // Check if user count is within limits
    const tenantConfig = tenantDoc.data() as TenantConfig;
    const usersSnapshot = await db
      .collection('tenants')
      .doc(tenantId)
      .collection('users')
      .count()
      .get();
    const currentUserCount = usersSnapshot.data().count;

    if (currentUserCount >= tenantConfig.maxUsers) {
      res.status(409).json({
        error: 'LIMIT_EXCEEDED',
        message: `Tenant has reached the maximum user limit (${tenantConfig.maxUsers}).`,
      });
      return;
    }

    // Check for existing invitation
    const existingInvite = await db
      .collection('tenants')
      .doc(tenantId)
      .collection('invitations')
      .doc(email)
      .get();

    if (existingInvite.exists) {
      res.status(409).json({
        error: 'CONFLICT',
        message: 'An invitation for this email already exists.',
      });
      return;
    }

    // Create invitation
    const now = new Date().toISOString();
    const invitation = {
      email,
      tenantId,
      role,
      permissions: permissions || [],
      invitedBy: req.user.uid,
      invitedByEmail: req.user.email,
      status: 'PENDING' as const,
      createdAt: now,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    };

    await db
      .collection('tenants')
      .doc(tenantId)
      .collection('invitations')
      .doc(email)
      .set(invitation);

    res.status(201).json({
      success: true,
      data: invitation,
    });
  } catch (error) {
    console.error('[Tenant] Invitation failed:', error);
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Failed to send invitation.',
    });
  }
}

// ============================================================
// POST /tenants/:tenantId/accept-invitation
// ============================================================

export async function acceptInvitation(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'UNAUTHORIZED',
        message: 'Authentication required.',
      });
      return;
    }

    const { tenantId } = req.params;

    // Look up invitation by the user's email
    const invitationRef = db
      .collection('tenants')
      .doc(tenantId)
      .collection('invitations')
      .doc(req.user.email);

    const invitationDoc = await invitationRef.get();

    if (!invitationDoc.exists) {
      res.status(404).json({
        error: 'NOT_FOUND',
        message: 'No invitation found for your email in this tenant.',
      });
      return;
    }

    const invitation = invitationDoc.data() as {
      email: string;
      tenantId: string;
      role: string;
      permissions: string[];
      status: string;
      expiresAt: string;
    };

    // Check invitation status
    if (invitation.status !== 'PENDING') {
      res.status(409).json({
        error: 'CONFLICT',
        message: `Invitation has already been ${invitation.status.toLowerCase()}.`,
      });
      return;
    }

    // Check expiration
    if (new Date(invitation.expiresAt) < new Date()) {
      res.status(410).json({
        error: 'GONE',
        message: 'This invitation has expired.',
      });
      return;
    }

    const now = new Date().toISOString();
    const batch = db.batch();

    // 1. Add user to tenant's users subcollection
    const tenantUserRef = db
      .collection('tenants')
      .doc(tenantId)
      .collection('users')
      .doc(req.user.uid);

    batch.set(tenantUserRef, {
      userId: req.user.uid,
      tenantId,
      assignedRole: invitation.role,
      permissions: invitation.permissions,
      email: req.user.email,
      fullName: '',
      isKycVerified: false,
      isDeveloper: false,
      joinedAt: now,
      createdAt: now,
    });

    // 2. Update user's GlobalUserProfile
    const userRef = db.collection('users').doc(req.user.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      res.status(404).json({
        error: 'NOT_FOUND',
        message: 'User profile not found.',
      });
      return;
    }

    const userProfile = userDoc.data() as GlobalUserProfile;
    const newMembership: TenantMembership = {
      tenantId,
      role: invitation.role,
      permissions: invitation.permissions,
      joinedAt: now,
    };

    batch.update(userRef, {
      tenantMemberships: [...userProfile.tenantMemberships, newMembership],
      updatedAt: now,
    });

    // 3. Mark invitation as accepted
    batch.update(invitationRef, {
      status: 'ACCEPTED',
      acceptedAt: now,
      acceptedBy: req.user.uid,
    });

    await batch.commit();

    res.json({
      success: true,
      data: {
        tenantId,
        role: invitation.role,
        permissions: invitation.permissions,
        joinedAt: now,
      },
    });
  } catch (error) {
    console.error('[Tenant] Accept invitation failed:', error);
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Failed to accept invitation.',
    });
  }
}

// ============================================================
// DELETE /tenants/:tenantId/users/:userId
// ============================================================

export async function removeUser(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'UNAUTHORIZED',
        message: 'Authentication required.',
      });
      return;
    }

    const { tenantId, userId } = req.params;

    // Prevent self-removal
    if (userId === req.user.uid) {
      res.status(400).json({
        error: 'BAD_REQUEST',
        message: 'You cannot remove yourself from the tenant. Transfer ownership first.',
      });
      return;
    }

    // Check user exists in tenant
    const tenantUserRef = db
      .collection('tenants')
      .doc(tenantId)
      .collection('users')
      .doc(userId);

    const tenantUserDoc = await tenantUserRef.get();
    if (!tenantUserDoc.exists) {
      res.status(404).json({
        error: 'NOT_FOUND',
        message: 'User not found in this tenant.',
      });
      return;
    }

    const now = new Date().toISOString();
    const batch = db.batch();

    // 1. Remove from tenant's users subcollection
    batch.delete(tenantUserRef);

    // 2. Update removed user's GlobalUserProfile
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      const userProfile = userDoc.data() as GlobalUserProfile;
      const updatedMemberships = userProfile.tenantMemberships.filter(
        (m) => m.tenantId !== tenantId,
      );

      const updates: Record<string, unknown> = {
        tenantMemberships: updatedMemberships,
        updatedAt: now,
      };

      // If the removed tenant was the active tenant, clear it
      if (userProfile.activeTenantId === tenantId) {
        updates.activeTenantId = updatedMemberships.length > 0
          ? updatedMemberships[0].tenantId
          : null;
      }

      batch.update(userRef, updates);
    }

    await batch.commit();

    res.json({
      success: true,
      data: {
        removedUserId: userId,
        tenantId,
      },
    });
  } catch (error) {
    console.error('[Tenant] Remove user failed:', error);
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Failed to remove user from tenant.',
    });
  }
}

// ============================================================
// PUT /tenants/:tenantId/settings
// ============================================================

interface UpdateSettingsBody {
  companyNameTH?: string;
  companyNameEN?: string;
  vatId?: string;
  dbdRegistrationNumber?: string | null;
  gpsTrackingMode?: GpsTrackingMode;
}

export async function updateTenantSettings(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { tenantId } = req.params;
    const body = req.body as UpdateSettingsBody;

    // Build update object with only provided fields
    const allowedFields: (keyof UpdateSettingsBody)[] = [
      'companyNameTH',
      'companyNameEN',
      'vatId',
      'dbdRegistrationNumber',
      'gpsTrackingMode',
    ];

    const validGpsModes: GpsTrackingMode[] = [
      'CHECK_IN_ONLY',
      'WORK_HOURS',
      'DISABLED',
    ];

    // Validate GPS tracking mode if provided
    if (body.gpsTrackingMode && !validGpsModes.includes(body.gpsTrackingMode)) {
      res.status(400).json({
        error: 'BAD_REQUEST',
        message: `Invalid gpsTrackingMode. Must be one of: ${validGpsModes.join(', ')}`,
      });
      return;
    }

    const updates: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };

    let hasUpdates = false;
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
        hasUpdates = true;
      }
    }

    if (!hasUpdates) {
      res.status(400).json({
        error: 'BAD_REQUEST',
        message: 'At least one setting field is required.',
      });
      return;
    }

    // Verify tenant exists
    const tenantRef = db.collection('tenants').doc(tenantId);
    const tenantDoc = await tenantRef.get();

    if (!tenantDoc.exists) {
      res.status(404).json({
        error: 'NOT_FOUND',
        message: 'Tenant not found.',
      });
      return;
    }

    await tenantRef.update(updates);

    // Return updated tenant
    const updatedDoc = await tenantRef.get();
    const updatedTenant = updatedDoc.data() as TenantConfig;

    res.json({
      success: true,
      data: updatedTenant,
    });
  } catch (error) {
    console.error('[Tenant] Settings update failed:', error);
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Failed to update tenant settings.',
    });
  }
}
