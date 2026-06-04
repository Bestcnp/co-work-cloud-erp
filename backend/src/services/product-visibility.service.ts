/**
 * Product Visibility Service
 *
 * Core compliance layer that enforces Thai substance restriction laws.
 * Ensures restricted products are NEVER returned to unverified users.
 *
 * Laws enforced:
 * - Alcohol Control Act Sec 32 (no public display of alcohol)
 * - Tobacco Products Control Act (total digital ban for public)
 * - Cannabis Regulations 2025 (medical-only, no public display)
 * - CBD < 0.2% THC exception (can be shown publicly)
 */

import { db } from '../config/firebase.js';
import type {
  ControlledSubstanceCategory,
  CompanyLicense,
  CompanyLicenseType,
  CompanyVerification,
} from '../models/index.js';
import { LICENSE_CATALOG_MAP } from '../models/index.js';

export interface VisibilityContext {
  isAuthenticated: boolean;
  userId: string | null;
  tenantId: string | null;
  isVerifiedCompany: boolean;
  companyLicenses: CompanyLicense[];
}

export class ProductVisibilityService {
  /**
   * Get the list of substance categories a user is allowed to see.
   * Public users: only NONE and CBD_BELOW_THRESHOLD
   * Verified B2B: NONE + CBD_BELOW_THRESHOLD + categories unlocked by their licenses
   */
  static getAllowedCategories(context: VisibilityContext): ControlledSubstanceCategory[] {
    // Everyone can see unrestricted products and CBD (< 0.2% THC)
    const allowed: ControlledSubstanceCategory[] = ['NONE', 'CBD_BELOW_THRESHOLD'];

    if (!context.isAuthenticated || !context.isVerifiedCompany) {
      return allowed;
    }

    // Add categories unlocked by each valid, verified license
    for (const license of context.companyLicenses) {
      if (!license.verified) continue;

      // Check license hasn't expired
      const now = new Date();
      const expiry = new Date(license.validUntil);
      if (expiry < now) continue;

      const unlockedCategories = LICENSE_CATALOG_MAP[license.licenseType] || [];
      for (const cat of unlockedCategories) {
        if (!allowed.includes(cat)) {
          allowed.push(cat);
        }
      }
    }

    return allowed;
  }

  /**
   * Check if a specific product is visible to the requesting user.
   */
  static isProductVisible(
    substanceCategory: ControlledSubstanceCategory,
    context: VisibilityContext,
  ): boolean {
    const allowed = ProductVisibilityService.getAllowedCategories(context);
    return allowed.includes(substanceCategory);
  }

  /**
   * Filter an array of products, removing any the user isn't allowed to see.
   * This MUST be called before returning any product list from an API.
   */
  static filterProducts<T extends { substanceCategory: ControlledSubstanceCategory }>(
    products: T[],
    context: VisibilityContext,
  ): T[] {
    const allowed = ProductVisibilityService.getAllowedCategories(context);
    return products.filter((p) => allowed.includes(p.substanceCategory));
  }

  /**
   * Build the visibility context for a request.
   * Call this from middleware or controllers to get the user's visibility level.
   */
  static async buildContext(
    userId: string | null,
    tenantId: string | null,
  ): Promise<VisibilityContext> {
    if (!userId || !tenantId) {
      return {
        isAuthenticated: false,
        userId: null,
        tenantId: null,
        isVerifiedCompany: false,
        companyLicenses: [],
      };
    }

    try {
      const verificationDoc = await db
        .collection('tenants')
        .doc(tenantId)
        .collection('verification')
        .doc('company')
        .get();

      if (!verificationDoc.exists) {
        return {
          isAuthenticated: true,
          userId,
          tenantId,
          isVerifiedCompany: false,
          companyLicenses: [],
        };
      }

      const verification = verificationDoc.data() as CompanyVerification;

      return {
        isAuthenticated: true,
        userId,
        tenantId,
        isVerifiedCompany: verification.step === 'FULLY_VERIFIED',
        companyLicenses: verification.licenses || [],
      };
    } catch (error) {
      console.error('[ProductVisibility] Failed to build context:', error);
      // Fail safe — restrict to public only
      return {
        isAuthenticated: true,
        userId,
        tenantId,
        isVerifiedCompany: false,
        companyLicenses: [],
      };
    }
  }
}
