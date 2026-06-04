/**
 * Company Profile Service
 *
 * Manages the dual-layer company profiles required by Thai law:
 * - PUBLIC profile: Generic description, NO restricted brand names
 * - B2B profile: Full brand details, catalogs, pricing (verified only)
 *
 * The public description is scanned by Hermes to ensure no restricted
 * brand names leak to public view.
 */

import { db } from '../config/firebase.js';
import { HermesService } from './hermes.service.js';
import { AuditService } from './audit.service.js';

export interface CompanyPublicProfile {
  tenantId: string;
  legalName: string;
  publicDescription: string;
  publicIndustry: string;
  logoUrl: string | null;
  websiteUrl: string | null;
  province: string;
  isVerified: boolean;
}

export interface CompanyB2bProfile {
  tenantId: string;
  b2bDescription: string;
  b2bBrands: string[];
  b2bCatalogCategories: string[];
  wholesalePricingVisible: boolean;
  contactEmail: string;
  contactPhone: string;
  minimumOrderTHB: number | null;
}

export interface PublicProfileScanResult {
  approved: boolean;
  violations: string[];
  hermesReasoning: string;
}

const BRAND_SCAN_PROMPT = `You are a Thai legal compliance scanner for a business directory platform.

Thai law (Alcohol Control Act Sec 32, Tobacco Act, Cannabis Regulations 2025) strictly prohibits displaying restricted brand names on public-facing pages.

Analyze the following company description and check if it contains:
1. Any specific alcohol brand names (e.g., Chang, SangSom, Heineken, Leo, Singha, etc.)
2. Any tobacco brand names (e.g., Marlboro, L&M, Camel, etc.)
3. Any cannabis/drug brand names
4. Any marketing language that could induce consumption of restricted substances
5. Any brand DNA (logos, trademarks, or slogans associated with restricted brands)

Respond ONLY with valid JSON:
{"approved": true/false, "violations": ["list of violations"], "reasoning": "brief explanation"}`;

export class CompanyProfileService {
  /**
   * Get the public profile (safe for unauthenticated users).
   */
  static async getPublicProfile(tenantId: string): Promise<CompanyPublicProfile | null> {
    const doc = await db
      .collection('tenants')
      .doc(tenantId)
      .collection('profiles')
      .doc('public')
      .get();

    return doc.exists ? (doc.data() as CompanyPublicProfile) : null;
  }

  /**
   * Get the B2B profile (only for verified companies with correct role).
   */
  static async getB2bProfile(tenantId: string): Promise<CompanyB2bProfile | null> {
    const doc = await db
      .collection('tenants')
      .doc(tenantId)
      .collection('profiles')
      .doc('b2b')
      .get();

    return doc.exists ? (doc.data() as CompanyB2bProfile) : null;
  }

  /**
   * Update public profile with Hermes brand-name scanning.
   * Rejects if restricted brand names are detected.
   */
  static async updatePublicProfile(
    tenantId: string,
    profile: Omit<CompanyPublicProfile, 'tenantId' | 'isVerified'>,
    updatedBy: string,
  ): Promise<{ success: boolean; scanResult: PublicProfileScanResult }> {
    // Scan the public description for restricted brand names
    const scanResult = await CompanyProfileService.scanPublicDescription(
      profile.publicDescription,
    );

    if (!scanResult.approved) {
      await AuditService.log({
        userId: updatedBy,
        userEmail: '',
        tenantId,
        action: 'PUBLIC_PROFILE_REJECTED',
        resourceType: 'COMPANY_PROFILE',
        resourceId: tenantId,
        details: { violations: scanResult.violations },
        ipAddress: 'system',
      });

      return { success: false, scanResult };
    }

    // Get current verification status
    const tenantDoc = await db.collection('tenants').doc(tenantId).get();
    const isVerified = tenantDoc.exists
      ? (tenantDoc.data()?.verificationStatus === 'VERIFIED')
      : false;

    const fullProfile: CompanyPublicProfile = {
      ...profile,
      tenantId,
      isVerified,
    };

    await db
      .collection('tenants')
      .doc(tenantId)
      .collection('profiles')
      .doc('public')
      .set(fullProfile, { merge: true });

    await AuditService.log({
      userId: updatedBy,
      userEmail: '',
      tenantId,
      action: 'PUBLIC_PROFILE_UPDATED',
      resourceType: 'COMPANY_PROFILE',
      resourceId: tenantId,
      details: {},
      ipAddress: 'system',
    });

    return { success: true, scanResult };
  }

  /**
   * Update B2B profile (no brand restrictions inside B2B).
   */
  static async updateB2bProfile(
    tenantId: string,
    profile: Omit<CompanyB2bProfile, 'tenantId'>,
    updatedBy: string,
  ): Promise<void> {
    const fullProfile: CompanyB2bProfile = {
      ...profile,
      tenantId,
    };

    await db
      .collection('tenants')
      .doc(tenantId)
      .collection('profiles')
      .doc('b2b')
      .set(fullProfile, { merge: true });

    await AuditService.log({
      userId: updatedBy,
      userEmail: '',
      tenantId,
      action: 'B2B_PROFILE_UPDATED',
      resourceType: 'COMPANY_PROFILE',
      resourceId: tenantId,
      details: {},
      ipAddress: 'system',
    });
  }

  /**
   * Scan a public-facing description for restricted brand names using Hermes.
   */
  static async scanPublicDescription(
    description: string,
  ): Promise<PublicProfileScanResult> {
    try {
      const prompt = `${BRAND_SCAN_PROMPT}\n\nCompany description to scan:\n"${description}"`;
      const response = await HermesService.analyzeContent(prompt);

      const jsonMatch = response.response.match(/\{[\s\S]*?\}/);
      if (!jsonMatch) {
        // If Hermes can't parse, fail safe — reject
        return {
          approved: false,
          violations: ['Unable to parse Hermes scan result — requires manual review'],
          hermesReasoning: response.response,
        };
      }

      const parsed = JSON.parse(jsonMatch[0]) as Record<string, unknown>;

      return {
        approved: Boolean(parsed.approved),
        violations: (parsed.violations as string[]) || [],
        hermesReasoning: String(parsed.reasoning || ''),
      };
    } catch (error) {
      console.error('[CompanyProfile] Hermes scan failed:', error);
      return {
        approved: false,
        violations: ['Hermes scan failed — requires manual review'],
        hermesReasoning: 'Error during scan',
      };
    }
  }
}
