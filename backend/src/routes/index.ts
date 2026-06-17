/**
 * API Route Aggregator
 *
 * Mounts all module routes under a unified router.
 * This is mounted at /api/v1 in the main entry point.
 */

import { Router } from 'express';
import healthRoutes from '../modules/health/health.routes.js';
import authRoutes from '../modules/auth/auth.routes.js';
import tenantRoutes from '../modules/tenant/tenant.routes.js';
import pdpaRoutes from '../modules/pdpa/pdpa.routes.js';

const router = Router();

// Public
router.use('/health', healthRoutes);

// Auth
router.use('/auth', authRoutes);

// Tenant-scoped
router.use('/tenants', tenantRoutes);

// PDPA Compliance
router.use('/pdpa', pdpaRoutes);

export default router;
