/**
 * Content Moderation Service
 *
 * Full moderation pipeline combining Hermes AI content analysis
 * with substance detection. Supports auto-approve/reject for
 * high-confidence results and manual review queue for uncertain cases.
 */

import { HermesService } from './hermes.service.js';
import { SubstanceGateService } from './substance-gate.service.js';
import { AuditService } from './audit.service.js';
import { db } from '../config/firebase.js';
import type {
  ModerationQueueItem,
  ModerationVerdict,
  ControlledSubstanceCategory,
} from '../models/index.js';

const MODERATION_COLLECTION = 'moderation_queue';
const AUTO_THRESHOLD = 0.9;

interface HermesModerationResponse {
  isClean: boolean;
  confidence: number;
  reasoning: string;
  issues: string[];
}

const MODERATION_PROMPT = `You are a content moderator for a Thai B2B/B2C marketplace platform.
Analyze the following content for policy violations:
- Illegal content
- Hate speech, discrimination
- Fraudulent claims
- Inappropriate or adult content
- Misleading product descriptions
- Counterfeit goods indicators

Respond ONLY with valid JSON in this exact format:
{"isClean": true, "confidence": 0.95, "reasoning": "Brief explanation", "issues": []}

Rules:
- isClean: true if content passes moderation, false if it violates policies
- confidence: 0.0 to 1.0
- issues: list of specific violations found (empty array if clean)
- Consider Thai cultural and legal context`;

export class ModerationService {
  /**
   * Submit content for AI-powered moderation review.
   * Combines content analysis with substance detection.
   */
  static async submitForReview(params: {
    contentType: ModerationQueueItem['contentType'];
    contentId: string;
    tenantId: string;
    submittedBy: string;
    contentText: string;
    contentTitle?: string;
  }): Promise<ModerationQueueItem> {
    const {
      contentType,
      contentId,
      tenantId,
      submittedBy,
      contentText,
      contentTitle = '',
    } = params;

    // Step 1: Hermes content moderation
    const moderationResult = await ModerationService.analyzeWithHermes(
      contentTitle,
      contentText,
    );

    // Step 2: Substance check
    const substanceResult = await SubstanceGateService.classifyProduct(
      contentTitle,
      contentText,
    );

    // Step 3: Determine verdict
    const hasSubstanceViolation = substanceResult.requiresRestriction;
    const combinedConfidence = Math.min(
      moderationResult.confidence,
      substanceResult.confidence,
    );

    let hermesVerdict: ModerationVerdict;
    if (combinedConfidence >= AUTO_THRESHOLD && moderationResult.isClean && !hasSubstanceViolation) {
      hermesVerdict = 'AUTO_APPROVED';
    } else if (combinedConfidence >= AUTO_THRESHOLD && (!moderationResult.isClean || hasSubstanceViolation)) {
      hermesVerdict = 'AUTO_REJECTED';
    } else {
      hermesVerdict = 'NEEDS_REVIEW';
    }

    // Step 4: Build the reasoning
    const reasoningParts: string[] = [moderationResult.reasoning];
    if (hasSubstanceViolation) {
      reasoningParts.push(
        `Substance: ${substanceResult.category} (${substanceResult.reasoning})`,
      );
    }
    if (moderationResult.issues.length > 0) {
      reasoningParts.push(`Issues: ${moderationResult.issues.join(', ')}`);
    }

    // Step 5: Save to Firestore
    const now = new Date().toISOString();
    const docRef = db.collection(MODERATION_COLLECTION).doc();
    const queueItem: ModerationQueueItem = {
      queueId: docRef.id,
      contentType,
      contentId,
      tenantId,
      submittedBy,
      hermesVerdict,
      hermesConfidence: combinedConfidence,
      hermesReasoning: reasoningParts.join(' | '),
      detectedSubstanceCategory: substanceResult.category,
      finalVerdict: hermesVerdict === 'NEEDS_REVIEW' ? null : hermesVerdict,
      reviewedBy: hermesVerdict === 'NEEDS_REVIEW' ? null : 'HERMES_AI',
      reviewedAt: hermesVerdict === 'NEEDS_REVIEW' ? null : now,
      createdAt: now,
    };

    await docRef.set(queueItem);

    // Step 6: Audit log
    void AuditService.log({
      userId: submittedBy,
      userEmail: '',
      tenantId,
      action: `MODERATION_SUBMIT:${contentType}`,
      resourceType: contentType,
      resourceId: contentId,
      ipAddress: 'system',
      details: {
        hermesVerdict,
        hermesConfidence: combinedConfidence,
        substanceCategory: substanceResult.category,
      },
    });

    return queueItem;
  }

  /**
   * Manually review and finalize a moderation queue item.
   */
  static async reviewItem(
    queueId: string,
    verdict: 'MANUALLY_APPROVED' | 'MANUALLY_REJECTED',
    reviewedBy: string,
  ): Promise<void> {
    const docRef = db.collection(MODERATION_COLLECTION).doc(queueId);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new Error(`Moderation queue item ${queueId} not found`);
    }

    const item = doc.data() as ModerationQueueItem;
    const now = new Date().toISOString();

    // Update the queue item
    await docRef.update({
      finalVerdict: verdict,
      reviewedBy,
      reviewedAt: now,
    });

    // Update the original content's moderation status
    const newStatus = verdict === 'MANUALLY_APPROVED' ? 'ACTIVE' : 'REJECTED';
    await ModerationService.updateContentStatus(
      item.contentType,
      item.contentId,
      item.tenantId,
      newStatus,
    );

    // Audit log
    void AuditService.log({
      userId: reviewedBy,
      userEmail: '',
      tenantId: item.tenantId,
      action: `MODERATION_REVIEW:${verdict}`,
      resourceType: item.contentType,
      resourceId: item.contentId,
      ipAddress: 'system',
      details: { queueId, verdict },
    });
  }

  /**
   * Get pending items that need manual review.
   */
  static async getPendingQueue(
    limit: number = 50,
  ): Promise<ModerationQueueItem[]> {
    const snapshot = await db
      .collection(MODERATION_COLLECTION)
      .where('hermesVerdict', '==', 'NEEDS_REVIEW')
      .where('finalVerdict', '==', null)
      .orderBy('createdAt', 'asc')
      .limit(limit)
      .get();

    return snapshot.docs.map((doc) => doc.data() as ModerationQueueItem);
  }

  /**
   * Analyze content using Hermes AI for policy violations.
   */
  private static async analyzeWithHermes(
    title: string,
    text: string,
  ): Promise<HermesModerationResponse> {
    const contentBlock = [
      title ? `Title: ${title}` : '',
      `Content: ${text}`,
    ]
      .filter(Boolean)
      .join('\n');

    const prompt = `${MODERATION_PROMPT}\n\nContent to moderate:\n${contentBlock}`;

    try {
      const response = await HermesService.analyzeContent(prompt);
      return ModerationService.parseModerationResponse(response.response);
    } catch (error) {
      console.error('[ModerationService] Hermes analysis failed:', error);
      // Fail safe — flag for manual review
      return {
        isClean: false,
        confidence: 0,
        reasoning: 'Hermes analysis failed — requires manual review',
        issues: ['ANALYSIS_FAILED'],
      };
    }
  }

  /**
   * Parse raw Hermes response into structured moderation result.
   */
  private static parseModerationResponse(raw: string): HermesModerationResponse {
    const jsonMatch = raw.match(/\{[\s\S]*?\}/);
    if (!jsonMatch) {
      return {
        isClean: false,
        confidence: 0,
        reasoning: 'Could not parse Hermes response',
        issues: ['PARSE_ERROR'],
      };
    }

    try {
      const parsed = JSON.parse(jsonMatch[0]) as Record<string, unknown>;

      return {
        isClean: Boolean(parsed.isClean),
        confidence: Math.max(0, Math.min(1, Number(parsed.confidence ?? 0))),
        reasoning: String(parsed.reasoning ?? ''),
        issues: Array.isArray(parsed.issues)
          ? parsed.issues.map(String)
          : [],
      };
    } catch {
      return {
        isClean: false,
        confidence: 0,
        reasoning: 'Failed to parse Hermes JSON response',
        issues: ['PARSE_ERROR'],
      };
    }
  }

  /**
   * Update the moderation status on the original content document.
   */
  private static async updateContentStatus(
    contentType: ModerationQueueItem['contentType'],
    contentId: string,
    tenantId: string,
    status: string,
  ): Promise<void> {
    try {
      const collectionMap: Record<ModerationQueueItem['contentType'], string> = {
        PRODUCT: 'master_products',
        SHOWCASE: 'designer_showcases',
        CHAT_MESSAGE: 'chat_messages',
        NEWS_POST: 'news_posts',
        COMPANY_PROFILE: 'users',
      };

      const collection = collectionMap[contentType];
      if (!collection) return;

      // Products are tenant-scoped; others vary
      if (contentType === 'PRODUCT') {
        await db
          .collection('tenants')
          .doc(tenantId)
          .collection(collection)
          .doc(contentId)
          .update({ moderationStatus: status, updatedAt: new Date().toISOString() });
      } else {
        await db
          .collection(collection)
          .doc(contentId)
          .update({ moderationStatus: status, updatedAt: new Date().toISOString() });
      }
    } catch (error) {
      console.error('[ModerationService] Failed to update content status:', error);
    }
  }
}
