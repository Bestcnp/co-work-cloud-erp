/**
 * Takedown Service
 *
 * Implements the Notice-and-Takedown workflow for Safe Harbor protection.
 * Under Thailand's Computer Crime Act Sec 15, platforms must respond
 * to government takedown requests within 24 hours to maintain liability shield.
 *
 * Also handles ETDA Digital Platform compliance requirements.
 */

import { db } from '../config/firebase.js';
import { AuditService } from './audit.service.js';

export type TakedownRequestStatus =
  | 'RECEIVED'
  | 'REVIEWING'
  | 'COMPLIED'
  | 'APPEALED'
  | 'EXPIRED';

export interface TakedownRequest {
  requestId: string;
  requestedBy: string;
  requestType: 'GOVERNMENT_ORDER' | 'RIGHTS_HOLDER' | 'USER_REPORT';
  targetContentType: string;
  targetContentId: string;
  tenantId: string | null;
  reason: string;
  legalBasis: string;
  receivedAt: string;
  deadline: string;
  status: TakedownRequestStatus;
  actionTaken: string | null;
  actionBy: string | null;
  completedAt: string | null;
}

const DEADLINE_HOURS = 24;

export class TakedownService {
  private static readonly COLLECTION = 'takedown_requests';

  /**
   * Create a new takedown request.
   * Automatically sets a 24-hour deadline.
   */
  static async createRequest(
    params: Omit<TakedownRequest, 'requestId' | 'receivedAt' | 'deadline' | 'status' | 'actionTaken' | 'actionBy' | 'completedAt'>,
  ): Promise<TakedownRequest> {
    const now = new Date();
    const deadline = new Date(now.getTime() + DEADLINE_HOURS * 60 * 60 * 1000);

    const requestId = `td_${now.getTime()}`;

    const request: TakedownRequest = {
      ...params,
      requestId,
      receivedAt: now.toISOString(),
      deadline: deadline.toISOString(),
      status: 'RECEIVED',
      actionTaken: null,
      actionBy: null,
      completedAt: null,
    };

    await db.collection(TakedownService.COLLECTION).doc(requestId).set(request);

    await AuditService.log({
      userId: 'system',
      userEmail: 'system',
      tenantId: params.tenantId,
      action: 'TAKEDOWN_REQUEST_RECEIVED',
      resourceType: 'TAKEDOWN',
      resourceId: requestId,
      details: {
        requestType: params.requestType,
        targetContentType: params.targetContentType,
        targetContentId: params.targetContentId,
        deadline: deadline.toISOString(),
      },
      ipAddress: 'system',
    });

    // TODO: Send alert to super admin team (push notification / email)
    console.warn(`[TAKEDOWN] ⚠️ New takedown request ${requestId} — deadline: ${deadline.toISOString()}`);

    return request;
  }

  /**
   * Comply with a takedown request — hide the content.
   */
  static async comply(
    requestId: string,
    adminUserId: string,
    actionDescription: string,
  ): Promise<void> {
    await db.collection(TakedownService.COLLECTION).doc(requestId).update({
      status: 'COMPLIED' as TakedownRequestStatus,
      actionTaken: actionDescription,
      actionBy: adminUserId,
      completedAt: new Date().toISOString(),
    });

    await AuditService.log({
      userId: adminUserId,
      userEmail: '',
      tenantId: null,
      action: 'TAKEDOWN_COMPLIED',
      resourceType: 'TAKEDOWN',
      resourceId: requestId,
      details: { actionDescription },
      ipAddress: 'system',
    });
  }

  /**
   * Get all pending takedown requests, ordered by deadline (most urgent first).
   */
  static async getPendingRequests(): Promise<TakedownRequest[]> {
    const snapshot = await db
      .collection(TakedownService.COLLECTION)
      .where('status', 'in', ['RECEIVED', 'REVIEWING'])
      .orderBy('deadline', 'asc')
      .get();

    return snapshot.docs.map((doc) => doc.data() as TakedownRequest);
  }

  /**
   * Get overdue takedown requests (past deadline, not yet complied).
   * CRITICAL: These put the platform at legal risk.
   */
  static async getOverdueRequests(): Promise<TakedownRequest[]> {
    const now = new Date().toISOString();
    const snapshot = await db
      .collection(TakedownService.COLLECTION)
      .where('status', 'in', ['RECEIVED', 'REVIEWING'])
      .where('deadline', '<', now)
      .get();

    return snapshot.docs.map((doc) => doc.data() as TakedownRequest);
  }

  /**
   * Get a specific takedown request.
   */
  static async getRequest(requestId: string): Promise<TakedownRequest | null> {
    const doc = await db.collection(TakedownService.COLLECTION).doc(requestId).get();
    return doc.exists ? (doc.data() as TakedownRequest) : null;
  }
}
