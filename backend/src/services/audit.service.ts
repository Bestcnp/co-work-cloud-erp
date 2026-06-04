/**
 * Audit Logging Service
 *
 * Records all significant actions for compliance and traceability.
 * Writes to the /audit_logs Firestore collection.
 */

import { db } from '../config/firebase.js';
import type { AuditLogEntry } from '../models/index.js';

const AUDIT_COLLECTION = 'audit_logs';
const DEFAULT_LIMIT = 50;

export class AuditService {
  /**
   * Write an audit log entry to Firestore.
   * Automatically adds a timestamp and generates a document ID.
   */
  static async log(
    entry: Omit<AuditLogEntry, 'logId' | 'timestamp'>,
  ): Promise<void> {
    try {
      const docRef = db.collection(AUDIT_COLLECTION).doc();
      const auditEntry: AuditLogEntry = {
        ...entry,
        logId: docRef.id,
        timestamp: new Date().toISOString(),
      };

      await docRef.set(auditEntry);
    } catch (error) {
      // Audit logging must never crash the request — log and swallow
      console.error('[AuditService] Failed to write audit log:', error);
    }
  }

  /**
   * Query audit logs for a specific user, ordered by timestamp descending.
   */
  static async getLogsForUser(
    userId: string,
    limit: number = DEFAULT_LIMIT,
  ): Promise<AuditLogEntry[]> {
    const snapshot = await db
      .collection(AUDIT_COLLECTION)
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map((doc) => doc.data() as AuditLogEntry);
  }

  /**
   * Query audit logs for a specific tenant, ordered by timestamp descending.
   */
  static async getLogsForTenant(
    tenantId: string,
    limit: number = DEFAULT_LIMIT,
  ): Promise<AuditLogEntry[]> {
    const snapshot = await db
      .collection(AUDIT_COLLECTION)
      .where('tenantId', '==', tenantId)
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map((doc) => doc.data() as AuditLogEntry);
  }
}
