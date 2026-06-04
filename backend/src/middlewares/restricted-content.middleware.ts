/**
 * Restricted Content Middleware
 *
 * Prevents unverified users from accessing restricted substance content
 * via direct URLs. If a verified user shares a product link with a
 * non-verified friend, this middleware blocks access.
 *
 * Thai Law: Alcohol Control Act Sec 32, Tobacco Act, Cannabis Regulations
 */

import type { Request, Response, NextFunction } from 'express';
import { db } from '../config/firebase.js';
import { ProductVisibilityService } from '../services/product-visibility.service.js';
import type { ControlledSubstanceCategory } from '../models/index.js';

/**
 * Factory that creates middleware to check if the user can access
 * content with a specific substance category.
 *
 * Usage in routes:
 * router.get('/products/:productId', requireVisibility(), getProduct);
 */
export function requireVisibility() {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    // Build visibility context from the authenticated user
    const userId = req.user?.uid || null;
    const tenantId = req.user?.tenantId || null;

    const context = await ProductVisibilityService.buildContext(userId, tenantId);

    // Attach context to request for use in controllers
    (req as unknown as Record<string, unknown>).visibilityContext = context;

    next();
  };
}

/**
 * Middleware that checks a SPECIFIC product's substance category
 * against the user's visibility context.
 *
 * Must be used AFTER requireVisibility() so the context is available.
 * The controller should call this check when loading a specific product.
 */
export function checkProductAccess(
  substanceCategory: ControlledSubstanceCategory,
  context: { isAuthenticated: boolean; isVerifiedCompany: boolean; companyLicenses: Array<{ licenseType: string; verified: boolean; validUntil: string }> },
): { allowed: boolean; reason: string } {
  const allowed = ProductVisibilityService.isProductVisible(substanceCategory, {
    isAuthenticated: context.isAuthenticated,
    userId: null,
    tenantId: null,
    isVerifiedCompany: context.isVerifiedCompany,
    companyLicenses: context.companyLicenses as Array<import('../models/index.js').CompanyLicense>,
  });

  if (!allowed) {
    if (!context.isAuthenticated) {
      return { allowed: false, reason: 'Authentication required to view this content.' };
    }
    if (!context.isVerifiedCompany) {
      return { allowed: false, reason: 'Company verification required to view restricted products.' };
    }
    return { allowed: false, reason: 'Your company does not hold the required license to view this product category.' };
  }

  return { allowed: true, reason: '' };
}
