/**
 * Emergency Freeze Middleware
 *
 * Blocks all write operations (POST, PUT, PATCH, DELETE) when the platform
 * is under emergency freeze. Reads freeze status from Firestore
 * /platform_config/emergency and caches it for 30 seconds.
 *
 * Skips:
 * - GET / HEAD / OPTIONS requests
 * - Super admin routes (paths starting with /admin/)
 */

import type { Request, Response, NextFunction } from 'express';
import { db } from '../config/firebase.js';
import type { PlatformFreezeConfig } from '../models/index.js';

const WRITE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
const CACHE_TTL_MS = 30_000; // 30 seconds

interface FreezeCache {
  config: PlatformFreezeConfig;
  fetchedAt: number;
}

let freezeCache: FreezeCache | null = null;

/**
 * Fetch the freeze config from Firestore, with a 30-second in-memory cache.
 */
async function getFreezeConfig(): Promise<PlatformFreezeConfig> {
  const now = Date.now();

  if (freezeCache && now - freezeCache.fetchedAt < CACHE_TTL_MS) {
    return freezeCache.config;
  }

  try {
    const doc = await db
      .collection('platform_config')
      .doc('emergency')
      .get();

    const config: PlatformFreezeConfig = doc.exists
      ? (doc.data() as PlatformFreezeConfig)
      : { isFrozen: false, frozenAt: '', frozenBy: '', reason: '' };

    freezeCache = { config, fetchedAt: now };
    return config;
  } catch (error) {
    console.error('[FreezeMiddleware] Failed to read freeze config:', error);
    // On error, fail open — do not block traffic if Firestore is unavailable
    return { isFrozen: false, frozenAt: '', frozenBy: '', reason: '' };
  }
}

export async function freezeMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  // Only check write operations
  if (!WRITE_METHODS.has(req.method)) {
    next();
    return;
  }

  // Skip super admin routes
  if (req.path.startsWith('/admin/')) {
    next();
    return;
  }

  const config = await getFreezeConfig();

  if (config.isFrozen) {
    res.status(503).json({
      error: 'PLATFORM_FROZEN',
      message:
        'The platform is under emergency maintenance. All write operations are suspended.',
      frozenAt: config.frozenAt,
      reason: config.reason,
    });
    return;
  }

  next();
}

/**
 * Manually invalidate the freeze cache (useful for testing or admin actions).
 */
export function invalidateFreezeCache(): void {
  freezeCache = null;
}
