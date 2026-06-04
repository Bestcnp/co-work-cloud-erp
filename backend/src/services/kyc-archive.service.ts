/**
 * KYC Archive Service
 *
 * Manages cold storage of KYC documents for deleted users.
 * PDPA Sec 33: Allows retention for 'establishment, compliance,
 * or exercise of legal claims' — max 5 years after account deletion.
 *
 * Access is strictly logged and limited to legal/compliance team.
 */

import { db } from '../config/firebase.js';
import { AuditService } from './audit.service.js';
import crypto from 'crypto';

export interface KycArchiveEntry {
  archiveId: string;
  originalUserId: string;
  originalEmailHash: string;
  idDocumentUrl: string;
  faceComparisonResult: 'MATCH' | 'NO_MATCH' | 'INCONCLUSIVE';
  verificationDate: string;
  accountDeletedAt: string;
  retentionYears: number;
  scheduledPurgeAt: string;
  accessLog: Array<{ accessedBy: string; accessedAt: string; reason: string }>;
  createdAt: string;
}

const DEFAULT_RETENTION_YEARS = 5;

export class KycArchiveService {
  private static readonly COLLECTION = 'kyc_archives';

  /**
   * Archive a user's KYC data when their account is deleted.
   * Called by PdpaService.deleteMyData().
   */
  static async archiveUserKyc(
    userId: string,
    email: string,
    idDocumentUrl: string,
    faceComparisonResult: 'MATCH' | 'NO_MATCH' | 'INCONCLUSIVE',
    verificationDate: string,
  ): Promise<string> {
    const now = new Date();
    const purgeDate = new Date(now);
    purgeDate.setFullYear(purgeDate.getFullYear() + DEFAULT_RETENTION_YEARS);

    const archiveId = `kyc_${now.getTime()}_${userId.slice(-6)}`;
    const emailHash = crypto.createHash('sha256').update(email).digest('hex');

    const entry: KycArchiveEntry = {
      archiveId,
      originalUserId: userId,
      originalEmailHash: emailHash,
      idDocumentUrl,
      faceComparisonResult,
      verificationDate,
      accountDeletedAt: now.toISOString(),
      retentionYears: DEFAULT_RETENTION_YEARS,
      scheduledPurgeAt: purgeDate.toISOString(),
      accessLog: [],
      createdAt: now.toISOString(),
    };

    await db.collection(KycArchiveService.COLLECTION).doc(archiveId).set(entry);

    await AuditService.log({
      userId: 'system',
      userEmail: 'system',
      tenantId: null,
      action: 'KYC_DATA_ARCHIVED',
      resourceType: 'KYC_ARCHIVE',
      resourceId: archiveId,
      details: { originalUserId: userId, scheduledPurgeAt: purgeDate.toISOString() },
      ipAddress: 'system',
    });

    return archiveId;
  }

  /**
   * Access archived KYC data. Requires a legal reason.
   * Every access is logged for PDPA compliance.
   */
  static async accessArchive(
    archiveId: string,
    accessedBy: string,
    reason: string,
  ): Promise<KycArchiveEntry | null> {
    const docRef = db.collection(KycArchiveService.COLLECTION).doc(archiveId);
    const doc = await docRef.get();

    if (!doc.exists) return null;

    // Log the access
    const entry = doc.data() as KycArchiveEntry;
    const accessLogEntry = {
      accessedBy,
      accessedAt: new Date().toISOString(),
      reason,
    };

    await docRef.update({
      accessLog: [...entry.accessLog, accessLogEntry],
    });

    await AuditService.log({
      userId: accessedBy,
      userEmail: '',
      tenantId: null,
      action: 'KYC_ARCHIVE_ACCESSED',
      resourceType: 'KYC_ARCHIVE',
      resourceId: archiveId,
      details: { reason },
      ipAddress: 'system',
    });

    return { ...entry, accessLog: [...entry.accessLog, accessLogEntry] };
  }

  /**
   * Purge expired KYC archives.
   * Should be run as a cron job (monthly recommended).
   */
  static async purgeExpired(): Promise<{ purgedCount: number; purgedIds: string[] }> {
    const now = new Date().toISOString();
    const snapshot = await db
      .collection(KycArchiveService.COLLECTION)
      .where('scheduledPurgeAt', '<=', now)
      .get();

    const purgedIds: string[] = [];
    const batch = db.batch();

    for (const doc of snapshot.docs) {
      batch.delete(doc.ref);
      purgedIds.push(doc.id);
    }

    if (purgedIds.length > 0) {
      await batch.commit();

      await AuditService.log({
        userId: 'system',
        userEmail: 'system',
        tenantId: null,
        action: 'KYC_ARCHIVES_PURGED',
        resourceType: 'KYC_ARCHIVE',
        resourceId: 'batch',
        details: { purgedCount: purgedIds.length, purgedIds },
        ipAddress: 'system',
      });
    }

    return { purgedCount: purgedIds.length, purgedIds };
  }

  /**
   * Search archive by original user ID (for legal investigations).
   */
  static async findByUserId(userId: string): Promise<KycArchiveEntry[]> {
    const snapshot = await db
      .collection(KycArchiveService.COLLECTION)
      .where('originalUserId', '==', userId)
      .get();

    return snapshot.docs.map((doc) => doc.data() as KycArchiveEntry);
  }
}
