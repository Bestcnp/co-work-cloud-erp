/**
 * PDPA Compliance Service
 *
 * Implements Thailand's Personal Data Protection Act (PDPA) requirements:
 * - Consent recording and version tracking
 * - Data access right (export all personal data)
 * - Right to erasure (anonymize + disable account)
 * - Consent validation
 *
 * Note: Audit logs are NEVER deleted per legal retention requirements.
 */

import { db, auth } from '../config/firebase.js';
import { AuditService } from './audit.service.js';
import type { PdpaConsent, GlobalUserProfile } from '../models/index.js';

const CURRENT_CONSENT_VERSION = '1.0';
const CONSENT_COLLECTION = 'pdpa_consents';
const USERS_COLLECTION = 'users';
const DELETED_PLACEHOLDER = '[DELETED]';

export class PdpaService {
  /**
   * Record a new PDPA consent for a user.
   * Updates the user's GlobalUserProfile with consent metadata.
   */
  static async recordConsent(
    userId: string,
    purposes: string[],
    ipAddress: string,
  ): Promise<PdpaConsent> {
    const now = new Date().toISOString();
    const docRef = db.collection(CONSENT_COLLECTION).doc();

    const consent: PdpaConsent = {
      consentId: docRef.id,
      userId,
      purposes,
      consentVersion: CURRENT_CONSENT_VERSION,
      ipAddress,
      consentedAt: now,
    };

    // Write consent and update user profile atomically
    const batch = db.batch();

    batch.set(docRef, consent);
    batch.update(db.collection(USERS_COLLECTION).doc(userId), {
      pdpaConsentedAt: now,
      pdpaConsentVersion: CURRENT_CONSENT_VERSION,
      updatedAt: now,
    });

    await batch.commit();

    void AuditService.log({
      userId,
      userEmail: '',
      tenantId: null,
      action: 'PDPA_CONSENT_RECORDED',
      resourceType: 'CONSENT',
      resourceId: consent.consentId,
      ipAddress,
      details: {
        purposes,
        consentVersion: CURRENT_CONSENT_VERSION,
      },
    });

    return consent;
  }

  /**
   * PDPA Data Access Right — export all personal data for a user.
   * Collects data from all relevant collections.
   */
  static async getMyData(userId: string): Promise<Record<string, unknown>> {
    const result: Record<string, unknown> = {
      exportedAt: new Date().toISOString(),
      userId,
    };

    // User profile
    const userDoc = await db.collection(USERS_COLLECTION).doc(userId).get();
    if (userDoc.exists) {
      result.profile = userDoc.data();
    }

    // PDPA consents
    const consentsSnap = await db
      .collection(CONSENT_COLLECTION)
      .where('userId', '==', userId)
      .orderBy('consentedAt', 'desc')
      .get();
    result.consents = consentsSnap.docs.map((doc) => doc.data());

    // Tenant memberships — scan all tenants for this user
    const tenantsSnap = await db.collection('tenants').get();
    const memberships: Record<string, unknown>[] = [];

    for (const tenantDoc of tenantsSnap.docs) {
      const memberDoc = await tenantDoc.ref
        .collection('users')
        .doc(userId)
        .get();

      if (memberDoc.exists) {
        memberships.push({
          tenantId: tenantDoc.id,
          ...memberDoc.data(),
        });
      }
    }
    result.tenantMemberships = memberships;

    // Tasks assigned to user (across all tenants)
    const tasksSnap = await db
      .collectionGroup('tasks')
      .where('assignees', 'array-contains', userId)
      .get();
    result.tasks = tasksSnap.docs.map((doc) => ({
      taskId: doc.id,
      ...doc.data(),
    }));

    // Chat messages by user
    const messagesSnap = await db
      .collectionGroup('messages')
      .where('senderId', '==', userId)
      .get();
    result.chatMessages = messagesSnap.docs.map((doc) => ({
      messageId: doc.id,
      ...doc.data(),
    }));

    return result;
  }

  /**
   * PDPA/GDPR Right to Erasure — anonymize user data and disable account.
   *
   * This does NOT delete audit logs (legal retention requirement).
   * Profile data is anonymized rather than deleted to preserve referential integrity.
   */
  static async deleteMyData(
    userId: string,
    ipAddress: string,
  ): Promise<void> {
    const now = new Date().toISOString();
    const batch = db.batch();

    // Step 1: Anonymize user profile
    const userRef = db.collection(USERS_COLLECTION).doc(userId);
    const userDoc = await userRef.get();
    const originalEmail = userDoc.exists
      ? (userDoc.data() as GlobalUserProfile).email
      : 'unknown';

    batch.update(userRef, {
      email: DELETED_PLACEHOLDER,
      displayName: DELETED_PLACEHOLDER,
      photoUrl: null,
      updatedAt: now,
    });

    // Step 2: Remove from all tenant memberships
    const tenantsSnap = await db.collection('tenants').get();

    for (const tenantDoc of tenantsSnap.docs) {
      const memberRef = tenantDoc.ref
        .collection('users')
        .doc(userId);
      const memberDoc = await memberRef.get();

      if (memberDoc.exists) {
        batch.delete(memberRef);
      }
    }

    await batch.commit();

    // Step 3: Disable Firebase Auth account (outside batch)
    try {
      await auth.updateUser(userId, { disabled: true });
    } catch (error) {
      console.error('[PdpaService] Failed to disable auth account:', error);
      // Continue — the data anonymization is the critical path
    }

    // Step 4: Audit log (preserved for legal requirements)
    void AuditService.log({
      userId,
      userEmail: originalEmail,
      tenantId: null,
      action: 'PDPA_DATA_DELETED',
      resourceType: 'USER',
      resourceId: userId,
      ipAddress,
      details: {
        note: 'User data anonymized per PDPA right to erasure. Audit logs retained per legal requirement.',
      },
    });
  }

  /**
   * Check if a user has a valid consent for the current version.
   */
  static async hasValidConsent(userId: string): Promise<boolean> {
    const userDoc = await db.collection(USERS_COLLECTION).doc(userId).get();

    if (!userDoc.exists) {
      return false;
    }

    const profile = userDoc.data() as GlobalUserProfile;
    return profile.pdpaConsentVersion === CURRENT_CONSENT_VERSION;
  }

  /**
   * Get the current consent version string.
   */
  static getCurrentVersion(): string {
    return CURRENT_CONSENT_VERSION;
  }
}
