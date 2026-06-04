/**
 * Authentication & Authorization Middleware
 *
 * Provides three layers of access control:
 * 1. requireAuth — verifies Firebase ID token
 * 2. requireTenantAccess — validates tenant membership
 * 3. requirePermission — checks granular permissions
 */

import type { Request, Response, NextFunction } from 'express';
import { auth, db } from '../config/firebase.js';

// Extend Express Request with authenticated user info
declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
        email: string;
        tenantId: string;
        isDeveloper: boolean;
        permissions?: string[];
      };
    }
  }
}

/**
 * Verify Firebase ID token from Authorization Bearer header.
 * In development with DEV_BYPASS_AUTH=true, creates a mock developer user.
 */
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  // Development bypass
  if (
    process.env.NODE_ENV === 'development' &&
    process.env.DEV_BYPASS_AUTH === 'true'
  ) {
    req.user = {
      uid: 'dev_user_001',
      email: 'developer@cowork.cloud',
      tenantId: 'dev_tenant_a',
      isDeveloper: true,
      permissions: ['*'],
    };
    next();
    return;
  }

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({
      error: 'UNAUTHORIZED',
      message: 'Missing or invalid Authorization header. Expected: Bearer <token>',
    });
    return;
  }

  const idToken = authHeader.slice(7);

  try {
    const decoded = await auth.verifyIdToken(idToken);
    req.user = {
      uid: decoded.uid,
      email: decoded.email || '',
      tenantId: (decoded.tenantId as string) || '',
      isDeveloper: (decoded.isDeveloper as boolean) || false,
      permissions: (decoded.permissions as string[]) || [],
    };
    next();
  } catch (error) {
    console.error('[Auth] Token verification failed:', error);
    res.status(401).json({
      error: 'UNAUTHORIZED',
      message: 'Invalid or expired authentication token.',
    });
  }
}

/**
 * Validate that the authenticated user belongs to the requested tenant.
 * Must be used after requireAuth.
 *
 * Reads tenantId from:
 * 1. Route params (req.params.tenantId)
 * 2. x-tenant-id header
 */
export function requireTenantAccess(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!req.user) {
    res.status(401).json({
      error: 'UNAUTHORIZED',
      message: 'Authentication required before tenant access check.',
    });
    return;
  }

  // Developer bypass — can access any tenant
  if (req.user.isDeveloper) {
    next();
    return;
  }

  const requestedTenant =
    req.params.tenantId ||
    (req.headers['x-tenant-id'] as string);

  if (!requestedTenant) {
    res.status(400).json({
      error: 'BAD_REQUEST',
      message: 'Tenant ID is required (route param or x-tenant-id header).',
    });
    return;
  }

  if (req.user.tenantId !== requestedTenant) {
    res.status(403).json({
      error: 'FORBIDDEN',
      message: 'You do not have access to this tenant.',
    });
    return;
  }

  next();
}

/**
 * Factory that returns middleware to check a specific permission.
 * Looks up the user's permissions in Firestore.
 *
 * @param permission - The permission string to check (e.g., 'can_manage_products')
 */
export function requirePermission(permission: string) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    if (!req.user) {
      res.status(401).json({
        error: 'UNAUTHORIZED',
        message: 'Authentication required.',
      });
      return;
    }

    // Developer wildcard — has all permissions
    if (req.user.isDeveloper || req.user.permissions?.includes('*')) {
      next();
      return;
    }

    // Check cached permissions first
    if (req.user.permissions?.includes(permission)) {
      next();
      return;
    }

    // Look up permissions from Firestore
    try {
      const tenantId =
        req.params.tenantId ||
        (req.headers['x-tenant-id'] as string) ||
        req.user.tenantId;

      const userDoc = await db
        .collection('tenants')
        .doc(tenantId)
        .collection('users')
        .doc(req.user.uid)
        .get();

      if (!userDoc.exists) {
        res.status(403).json({
          error: 'FORBIDDEN',
          message: 'User not found in tenant.',
        });
        return;
      }

      const userData = userDoc.data();
      const permissions = (userData?.permissions as string[]) || [];

      if (!permissions.includes(permission) && !permissions.includes('*')) {
        res.status(403).json({
          error: 'FORBIDDEN',
          message: `Missing required permission: ${permission}`,
        });
        return;
      }

      // Cache permissions on the request for subsequent checks
      req.user.permissions = permissions;
      next();
    } catch (error) {
      console.error('[Auth] Permission check failed:', error);
      res.status(500).json({
        error: 'INTERNAL_ERROR',
        message: 'Failed to verify permissions.',
      });
    }
  };
}
