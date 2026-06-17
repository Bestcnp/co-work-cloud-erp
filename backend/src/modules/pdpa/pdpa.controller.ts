/**
 * PDPA Controller
 *
 * Handles PDPA (Personal Data Protection Act) endpoints:
 * - Record consent
 * - Export personal data (data access right)
 * - Delete personal data (right to erasure)
 * - Check consent status
 */

import type { Request, Response } from 'express';
import { PdpaService } from '../../services/pdpa.service.js';

export class PdpaController {
  /**
   * POST /pdpa/consent
   * Record user consent for data processing purposes.
   */
  static async recordConsent(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'UNAUTHORIZED',
          message: 'Authentication required.',
        });
        return;
      }

      const { purposes } = req.body as { purposes?: string[] };

      if (!purposes || !Array.isArray(purposes) || purposes.length === 0) {
        res.status(400).json({
          error: 'BAD_REQUEST',
          message: 'purposes must be a non-empty array of strings.',
        });
        return;
      }

      const ipAddress =
        (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() ??
        req.socket.remoteAddress ??
        'unknown';

      const consent = await PdpaService.recordConsent(
        req.user.uid,
        purposes,
        ipAddress,
      );

      res.status(201).json({
        message: 'Consent recorded successfully.',
        consent,
      });
    } catch (error) {
      console.error('[PdpaController] recordConsent error:', error);
      res.status(500).json({
        error: 'INTERNAL_ERROR',
        message: 'Failed to record consent.',
      });
    }
  }

  /**
   * GET /pdpa/my-data
   * Export all personal data for the authenticated user (PDPA data access right).
   */
  static async getMyData(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'UNAUTHORIZED',
          message: 'Authentication required.',
        });
        return;
      }

      const data = await PdpaService.getMyData(req.user.uid);

      res.json({
        message: 'Personal data export generated.',
        data,
      });
    } catch (error) {
      console.error('[PdpaController] getMyData error:', error);
      res.status(500).json({
        error: 'INTERNAL_ERROR',
        message: 'Failed to export personal data.',
      });
    }
  }

  /**
   * DELETE /pdpa/my-data
   * Delete (anonymize) all personal data for the authenticated user.
   * This is irreversible.
   */
  static async deleteMyData(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'UNAUTHORIZED',
          message: 'Authentication required.',
        });
        return;
      }

      const ipAddress =
        (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() ??
        req.socket.remoteAddress ??
        'unknown';

      await PdpaService.deleteMyData(req.user.uid, ipAddress);

      res.json({
        message: 'Your personal data has been anonymized and your account has been disabled.',
      });
    } catch (error) {
      console.error('[PdpaController] deleteMyData error:', error);
      res.status(500).json({
        error: 'INTERNAL_ERROR',
        message: 'Failed to delete personal data.',
      });
    }
  }

  /**
   * GET /pdpa/consent-status
   * Check if the authenticated user has valid consent for the current version.
   */
  static async getConsentStatus(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'UNAUTHORIZED',
          message: 'Authentication required.',
        });
        return;
      }

      const hasConsent = await PdpaService.hasValidConsent(req.user.uid);

      res.json({
        userId: req.user.uid,
        hasValidConsent: hasConsent,
        currentVersion: PdpaService.getCurrentVersion(),
      });
    } catch (error) {
      console.error('[PdpaController] getConsentStatus error:', error);
      res.status(500).json({
        error: 'INTERNAL_ERROR',
        message: 'Failed to check consent status.',
      });
    }
  }
}
