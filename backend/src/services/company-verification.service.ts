/**
 * Company Verification Service
 *
 * Implements the 3-step verification process required by Thai law:
 * 1. Corporate Identity — DBD registration + Tax ID
 * 2. Authorized Person — Director's Thai ID verification
 * 3. License Verification — Excise/MoPH/FDA licenses
 *
 * Laws: ETDA Platform Regulations 2025, Excise Department, PDPA
 */

import { db } from '../config/firebase.js';
import { AuditService } from './audit.service.js';
import type {
  CompanyVerification,
  CompanyVerificationStep,
  CompanyLicense,
  CompanyLicenseType,
  ControlledSubstanceCategory,
} from '../models/index.js';
import { LICENSE_CATALOG_MAP } from '../models/index.js';

export class CompanyVerificationService {
  private static readonly COLLECTION_PATH = 'verification';
  private static readonly DOC_ID = 'company';

  /**
   * Initialize verification for a new tenant.
   */
  static async initializeVerification(tenantId: string): Promise<CompanyVerification> {
    const verification: CompanyVerification = {
      tenantId,
      step: 'PENDING',
      dbdCertificateUrl: null,
      dbdVerified: false,
      dbdVerifiedAt: null,
      taxIdVerified: false,
      authorizedPersonName: null,
      authorizedPersonIdUrl: null,
      authorizedPersonVerified: false,
      authorizedPersonVerifiedAt: null,
      licenses: [],
      rejectionReason: null,
      verifiedBy: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db
      .collection('tenants')
      .doc(tenantId)
      .collection(CompanyVerificationService.COLLECTION_PATH)
      .doc(CompanyVerificationService.DOC_ID)
      .set(verification);

    return verification;
  }

  /**
   * Step 1: Submit DBD registration documents.
   */
  static async submitDbdDocuments(
    tenantId: string,
    dbdCertificateUrl: string,
    taxId: string,
  ): Promise<void> {
    await db
      .collection('tenants')
      .doc(tenantId)
      .collection(CompanyVerificationService.COLLECTION_PATH)
      .doc(CompanyVerificationService.DOC_ID)
      .update({
        step: 'DBD_SUBMITTED' as CompanyVerificationStep,
        dbdCertificateUrl,
        updatedAt: new Date().toISOString(),
      });

    // Also update the tenant's vatId
    await db.collection('tenants').doc(tenantId).update({ vatId: taxId });
  }

  /**
   * Admin: Verify DBD documents (Step 1 approval).
   */
  static async verifyDbd(
    tenantId: string,
    adminUserId: string,
    approved: boolean,
    rejectionReason?: string,
  ): Promise<void> {
    const update: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };

    if (approved) {
      update.step = 'DBD_VERIFIED' as CompanyVerificationStep;
      update.dbdVerified = true;
      update.dbdVerifiedAt = new Date().toISOString();
      update.taxIdVerified = true;
    } else {
      update.step = 'REJECTED' as CompanyVerificationStep;
      update.rejectionReason = rejectionReason || 'DBD documents could not be verified.';
    }

    await db
      .collection('tenants')
      .doc(tenantId)
      .collection(CompanyVerificationService.COLLECTION_PATH)
      .doc(CompanyVerificationService.DOC_ID)
      .update(update);

    await AuditService.log({
      userId: adminUserId,
      userEmail: '',
      tenantId,
      action: approved ? 'COMPANY_DBD_VERIFIED' : 'COMPANY_DBD_REJECTED',
      resourceType: 'COMPANY_VERIFICATION',
      resourceId: tenantId,
      details: { approved, rejectionReason },
      ipAddress: 'system',
    });
  }

  /**
   * Step 2: Submit authorized person's Thai ID.
   * IMPORTANT: Religion and Blood Type must be redacted before upload.
   */
  static async submitAuthorizedPerson(
    tenantId: string,
    personName: string,
    idDocumentUrl: string,
  ): Promise<void> {
    await db
      .collection('tenants')
      .doc(tenantId)
      .collection(CompanyVerificationService.COLLECTION_PATH)
      .doc(CompanyVerificationService.DOC_ID)
      .update({
        step: 'PERSON_SUBMITTED' as CompanyVerificationStep,
        authorizedPersonName: personName,
        authorizedPersonIdUrl: idDocumentUrl,
        updatedAt: new Date().toISOString(),
      });
  }

  /**
   * Admin: Verify authorized person (Step 2 approval).
   */
  static async verifyAuthorizedPerson(
    tenantId: string,
    adminUserId: string,
    approved: boolean,
    rejectionReason?: string,
  ): Promise<void> {
    const update: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };

    if (approved) {
      update.step = 'PERSON_VERIFIED' as CompanyVerificationStep;
      update.authorizedPersonVerified = true;
      update.authorizedPersonVerifiedAt = new Date().toISOString();
    } else {
      update.step = 'REJECTED' as CompanyVerificationStep;
      update.rejectionReason = rejectionReason || 'Authorized person could not be verified.';
    }

    await db
      .collection('tenants')
      .doc(tenantId)
      .collection(CompanyVerificationService.COLLECTION_PATH)
      .doc(CompanyVerificationService.DOC_ID)
      .update(update);

    await AuditService.log({
      userId: adminUserId,
      userEmail: '',
      tenantId,
      action: approved ? 'COMPANY_PERSON_VERIFIED' : 'COMPANY_PERSON_REJECTED',
      resourceType: 'COMPANY_VERIFICATION',
      resourceId: tenantId,
      details: { approved, rejectionReason },
      ipAddress: 'system',
    });
  }

  /**
   * Step 3: Submit a business license (can submit multiple).
   */
  static async submitLicense(
    tenantId: string,
    license: Omit<CompanyLicense, 'verified' | 'verifiedBy' | 'verifiedAt'>,
  ): Promise<void> {
    const fullLicense: CompanyLicense = {
      ...license,
      verified: false,
      verifiedBy: null,
      verifiedAt: null,
    };

    const docRef = db
      .collection('tenants')
      .doc(tenantId)
      .collection(CompanyVerificationService.COLLECTION_PATH)
      .doc(CompanyVerificationService.DOC_ID);

    const doc = await docRef.get();
    if (!doc.exists) {
      throw new Error('Company verification not initialized.');
    }

    const data = doc.data() as CompanyVerification;
    const licenses = [...data.licenses, fullLicense];

    await docRef.update({
      licenses,
      updatedAt: new Date().toISOString(),
    });
  }

  /**
   * Admin: Verify a specific license and potentially complete verification.
   */
  static async verifyLicense(
    tenantId: string,
    licenseId: string,
    adminUserId: string,
    approved: boolean,
    rejectionReason?: string,
  ): Promise<void> {
    const docRef = db
      .collection('tenants')
      .doc(tenantId)
      .collection(CompanyVerificationService.COLLECTION_PATH)
      .doc(CompanyVerificationService.DOC_ID);

    const doc = await docRef.get();
    if (!doc.exists) {
      throw new Error('Company verification not found.');
    }

    const data = doc.data() as CompanyVerification;
    const licenses = data.licenses.map((l) => {
      if (l.licenseId === licenseId) {
        return {
          ...l,
          verified: approved,
          verifiedBy: adminUserId,
          verifiedAt: new Date().toISOString(),
        };
      }
      return l;
    });

    // Check if we can move to FULLY_VERIFIED
    // Requires: DBD verified + Person verified + at least one verified license
    const hasVerifiedLicense = licenses.some((l) => l.verified);
    const isFullyVerified =
      data.dbdVerified &&
      data.authorizedPersonVerified &&
      hasVerifiedLicense;

    const update: Record<string, unknown> = {
      licenses,
      updatedAt: new Date().toISOString(),
    };

    if (isFullyVerified) {
      update.step = 'FULLY_VERIFIED' as CompanyVerificationStep;
      update.verifiedBy = adminUserId;

      // Also update the main tenant config
      await db.collection('tenants').doc(tenantId).update({
        verificationStatus: 'VERIFIED',
      });
    }

    await docRef.update(update);

    await AuditService.log({
      userId: adminUserId,
      userEmail: '',
      tenantId,
      action: approved ? 'COMPANY_LICENSE_VERIFIED' : 'COMPANY_LICENSE_REJECTED',
      resourceType: 'COMPANY_LICENSE',
      resourceId: licenseId,
      details: { approved, rejectionReason, isFullyVerified },
      ipAddress: 'system',
    });
  }

  /**
   * Get the current verification status for a tenant.
   */
  static async getVerification(tenantId: string): Promise<CompanyVerification | null> {
    const doc = await db
      .collection('tenants')
      .doc(tenantId)
      .collection(CompanyVerificationService.COLLECTION_PATH)
      .doc(CompanyVerificationService.DOC_ID)
      .get();

    return doc.exists ? (doc.data() as CompanyVerification) : null;
  }

  /**
   * Get all tenants pending verification (for admin dashboard).
   */
  static async getPendingVerifications(limit = 50): Promise<CompanyVerification[]> {
    const snapshot = await db
      .collectionGroup(CompanyVerificationService.COLLECTION_PATH)
      .where('step', 'not-in', ['FULLY_VERIFIED', 'PENDING', 'REJECTED'])
      .limit(limit)
      .get();

    return snapshot.docs.map((doc) => doc.data() as CompanyVerification);
  }

  /**
   * Get substance categories a company is licensed for.
   */
  static getLicensedCategories(licenses: CompanyLicense[]): ControlledSubstanceCategory[] {
    const categories = new Set<ControlledSubstanceCategory>();

    for (const license of licenses) {
      if (!license.verified) continue;
      const now = new Date();
      if (new Date(license.validUntil) < now) continue;

      const mapped = LICENSE_CATALOG_MAP[license.licenseType] || [];
      for (const cat of mapped) {
        categories.add(cat);
      }
    }

    return Array.from(categories);
  }
}
