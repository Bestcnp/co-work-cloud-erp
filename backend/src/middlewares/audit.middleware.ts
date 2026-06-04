/**
 * Audit Middleware
 *
 * Automatically logs all write operations (POST, PUT, PATCH, DELETE)
 * after the response has been sent to the client.
 *
 * Skips:
 * - GET / HEAD / OPTIONS requests
 * - Health check routes (/health*)
 */

import type { Request, Response, NextFunction } from 'express';
import { AuditService } from '../services/audit.service.js';

const WRITE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
const SKIP_PATHS = ['/health'];

function shouldSkip(req: Request): boolean {
  if (!WRITE_METHODS.has(req.method)) {
    return true;
  }
  return SKIP_PATHS.some((path) => req.path.startsWith(path));
}

export function auditMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (shouldSkip(req)) {
    next();
    return;
  }

  // Run AFTER the response is sent so we don't block the response
  res.on('finish', () => {
    const userId = req.user?.uid ?? 'anonymous';
    const email = req.user?.email ?? 'unknown';
    const tenantId = req.user?.tenantId ?? '';
    const ipAddress =
      (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() ??
      req.socket.remoteAddress ??
      'unknown';

    // Fire-and-forget — errors are caught inside AuditService.log
    void AuditService.log({
      userId,
      userEmail: email,
      tenantId,
      action: `${req.method} ${req.originalUrl}`,
      resourceType: 'HTTP_REQUEST',
      resourceId: req.originalUrl,
      ipAddress,
      details: {
        statusCode: res.statusCode,
        contentLength: res.getHeader('content-length'),
      },
    });
  });

  next();
}
