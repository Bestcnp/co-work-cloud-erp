/**
 * PDPA Routes
 *
 * Personal Data Protection Act compliance endpoints.
 * All routes require authentication.
 */

import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { PdpaController } from '../controllers/pdpa.controller.js';

const router = Router();

// All PDPA routes require authentication
router.use(requireAuth);

/**
 * POST /pdpa/consent
 * Record user consent for data processing.
 * Body: { purposes: string[] }
 */
router.post('/consent', PdpaController.recordConsent);

/**
 * GET /pdpa/my-data
 * Export all personal data (PDPA data access right).
 */
router.get('/my-data', PdpaController.getMyData);

/**
 * DELETE /pdpa/my-data
 * Anonymize and delete all personal data (right to erasure).
 */
router.delete('/my-data', PdpaController.deleteMyData);

/**
 * GET /pdpa/consent-status
 * Check if the user's consent is valid for the current version.
 */
router.get('/consent-status', PdpaController.getConsentStatus);

export default router;
