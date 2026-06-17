/**
 * Auth Controller
 *
 * Handles user registration, profile management, tenant switching,
 * and PDPA consent for the multi-company auth system.
 */

import type { Request, Response } from 'express';
import { auth, db, setTenantCustomClaims } from '../../config/firebase.js';
import type { GlobalUserProfile, PdpaConsent } from '../../models/index.js';

// ============================================================
// POST /auth/register
// ============================================================

interface RegisterBody {
  email: string;
  password: string;
  displayName: string;
  pdpaConsentVersion: string;
  pdpaConsentPurposes: string[];
}

export async function registerUser(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const {
      email,
      password,
      displayName,
      pdpaConsentVersion,
      pdpaConsentPurposes,
    } = req.body as RegisterBody;

    // Validate required fields
    if (!email || !password || !displayName) {
      res.status(400).json({
        error: 'BAD_REQUEST',
        message: 'email, password, and displayName are required.',
      });
      return;
    }

    if (!pdpaConsentVersion || !pdpaConsentPurposes?.length) {
      res.status(400).json({
        error: 'BAD_REQUEST',
        message: 'PDPA consent (pdpaConsentVersion and pdpaConsentPurposes) is required.',
      });
      return;
    }

    // Create Firebase Auth user
    const userRecord = await auth.createUser({
      email,
      password,
      displayName,
    });

    const now = new Date().toISOString();

    // Create GlobalUserProfile in Firestore
    const userProfile: GlobalUserProfile = {
      uid: userRecord.uid,
      email,
      displayName,
      photoUrl: null,
      kycStatus: 'PENDING',
      activeTenantId: null,
      tenantMemberships: [],
      pdpaConsentedAt: now,
      pdpaConsentVersion,
      isGlobalAdmin: false,
      isSuperAdminTeam: false,
      createdAt: now,
      updatedAt: now,
    };

    await db.collection('users').doc(userRecord.uid).set(userProfile);

    // Record PDPA consent
    const consentId = db.collection('pdpa_consents').doc().id;
    const pdpaConsent: PdpaConsent = {
      consentId,
      userId: userRecord.uid,
      consentVersion: pdpaConsentVersion,
      consentedAt: now,
      purposes: pdpaConsentPurposes,
      ipAddress: req.ip || req.socket.remoteAddress || 'unknown',
    };

    await db.collection('pdpa_consents').doc(consentId).set(pdpaConsent);

    res.status(201).json({
      success: true,
      data: {
        uid: userRecord.uid,
        email: userProfile.email,
        displayName: userProfile.displayName,
        createdAt: userProfile.createdAt,
      },
    });
  } catch (error) {
    console.error('[Auth] Registration failed:', error);

    // Handle Firebase Auth specific errors
    if (error instanceof Error && 'code' in error) {
      const firebaseError = error as Error & { code: string };
      if (firebaseError.code === 'auth/email-already-exists') {
        res.status(409).json({
          error: 'CONFLICT',
          message: 'A user with this email already exists.',
        });
        return;
      }
      if (firebaseError.code === 'auth/invalid-password') {
        res.status(400).json({
          error: 'BAD_REQUEST',
          message: 'Password must be at least 6 characters.',
        });
        return;
      }
    }

    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Failed to register user.',
    });
  }
}

// ============================================================
// POST /auth/switch-tenant
// ============================================================

interface SwitchTenantBody {
  tenantId: string;
}

export async function switchTenant(
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

    const { tenantId } = req.body as SwitchTenantBody;

    if (!tenantId) {
      res.status(400).json({
        error: 'BAD_REQUEST',
        message: 'tenantId is required.',
      });
      return;
    }

    // Fetch the user's global profile
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    if (!userDoc.exists) {
      res.status(404).json({
        error: 'NOT_FOUND',
        message: 'User profile not found.',
      });
      return;
    }

    const userProfile = userDoc.data() as GlobalUserProfile;

    // Validate tenant membership
    const membership = userProfile.tenantMemberships.find(
      (m) => m.tenantId === tenantId,
    );

    if (!membership) {
      res.status(403).json({
        error: 'FORBIDDEN',
        message: 'You are not a member of the requested tenant.',
      });
      return;
    }

    // Verify tenant exists and is not frozen
    const tenantDoc = await db.collection('tenants').doc(tenantId).get();
    if (!tenantDoc.exists) {
      res.status(404).json({
        error: 'NOT_FOUND',
        message: 'Tenant not found.',
      });
      return;
    }

    const tenantData = tenantDoc.data();
    if (tenantData?.isEmergencyFrozen) {
      res.status(403).json({
        error: 'FORBIDDEN',
        message: 'This tenant is currently frozen. Contact support.',
      });
      return;
    }

    // Update activeTenantId in user profile
    const now = new Date().toISOString();
    await db.collection('users').doc(req.user.uid).update({
      activeTenantId: tenantId,
      updatedAt: now,
    });

    // Update custom claims for tenant isolation
    await setTenantCustomClaims(req.user.uid, tenantId, {
      role: membership.role,
      permissions: membership.permissions,
    });

    res.json({
      success: true,
      data: {
        activeTenantId: tenantId,
        role: membership.role,
        permissions: membership.permissions,
      },
    });
  } catch (error) {
    console.error('[Auth] Tenant switch failed:', error);
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Failed to switch tenant.',
    });
  }
}

// ============================================================
// GET /auth/profile
// ============================================================

export async function getProfile(
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

    const userDoc = await db.collection('users').doc(req.user.uid).get();
    if (!userDoc.exists) {
      res.status(404).json({
        error: 'NOT_FOUND',
        message: 'User profile not found.',
      });
      return;
    }

    const userProfile = userDoc.data() as GlobalUserProfile;

    res.json({
      success: true,
      data: userProfile,
    });
  } catch (error) {
    console.error('[Auth] Profile fetch failed:', error);
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Failed to fetch profile.',
    });
  }
}

// ============================================================
// PUT /auth/profile
// ============================================================

interface UpdateProfileBody {
  displayName?: string;
  photoUrl?: string | null;
}

export async function updateProfile(
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

    const { displayName, photoUrl } = req.body as UpdateProfileBody;

    if (!displayName && photoUrl === undefined) {
      res.status(400).json({
        error: 'BAD_REQUEST',
        message: 'At least one field (displayName or photoUrl) is required.',
      });
      return;
    }

    const updates: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };

    // Update Firebase Auth profile
    const authUpdates: Record<string, string> = {};

    if (displayName) {
      updates.displayName = displayName;
      authUpdates.displayName = displayName;
    }

    if (photoUrl !== undefined) {
      updates.photoUrl = photoUrl;
      if (photoUrl) {
        authUpdates.photoURL = photoUrl;
      }
    }

    // Update Firebase Auth user record
    if (Object.keys(authUpdates).length > 0) {
      await auth.updateUser(req.user.uid, authUpdates);
    }

    // Update Firestore profile
    await db.collection('users').doc(req.user.uid).update(updates);

    // Return updated profile
    const updatedDoc = await db.collection('users').doc(req.user.uid).get();
    const updatedProfile = updatedDoc.data() as GlobalUserProfile;

    res.json({
      success: true,
      data: updatedProfile,
    });
  } catch (error) {
    console.error('[Auth] Profile update failed:', error);
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Failed to update profile.',
    });
  }
}
