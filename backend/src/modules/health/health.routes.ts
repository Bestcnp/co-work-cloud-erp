/**
 * Health Check Routes
 *
 * Provides system health and connectivity status endpoints.
 * These routes do NOT require authentication.
 */

import { Router } from 'express';
import { HermesService } from '../../services/hermes.service.js';

const router = Router();

/**
 * GET /health
 * Basic health check — confirms the API server is running.
 */
router.get('/', (_req, res) => {
  res.json({
    status: 'healthy',
    service: 'co-work-cloud-erp-backend',
    environment: process.env.NODE_ENV || 'unknown',
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /health/hermes
 * Check Ollama/Hermes AI connectivity and available models.
 */
router.get('/hermes', async (_req, res) => {
  try {
    const status = await HermesService.checkConnection();
    res.json({
      service: 'hermes-ai',
      ...status,
      ollamaHost: process.env.OLLAMA_HOST || 'http://host.docker.internal:11434',
      defaultModel: process.env.HERMES_MODEL || 'hermes3:8b',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      service: 'hermes-ai',
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
