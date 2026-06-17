/**
 * Co-Work Cloud ERP — Backend Entry Point
 *
 * Express server with Firebase, Hermes AI, and multi-tenant middleware.
 * Routes are mounted under /api/v1 via the route aggregator.
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { DatabaseRouter } from './config/database-router.js';
import apiRouter from './routes/index.js';
import healthRoutes from './modules/health/health.routes.js';
import { globalRateLimit } from './middlewares/rate-limit.middleware.js';
import { freezeMiddleware } from './middlewares/freeze.middleware.js';
import { auditMiddleware } from './middlewares/audit.middleware.js';
import { errorHandler } from './middlewares/error-handler.middleware.js';
import { logger } from './lib/logger.js';

// Initialize database connection
const { isSandboxEnvironment } = DatabaseRouter.initializeDatabaseConnection();

// Create Express app
const app = express();

// ============================================================
// Global Middleware
// ============================================================
app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(globalRateLimit);
app.use(freezeMiddleware);
app.use(auditMiddleware);

// ============================================================
// Routes — Health (root level for Docker healthchecks)
// ============================================================
app.use('/health', healthRoutes);

// ============================================================
// Routes — API v1 (all authenticated/business routes)
// ============================================================
app.use('/api/v1', apiRouter);

// ============================================================
// Error Handling (must be AFTER all routes)
// ============================================================
app.use(errorHandler);

// ============================================================
// Start Server
// ============================================================
const PORT = parseInt(process.env.PORT || '5001', 10);

app.listen(PORT, '0.0.0.0', () => {
  logger.info('Server started', {
    url: `http://0.0.0.0:${PORT}`,
    environment: isSandboxEnvironment ? 'SANDBOX' : 'PRODUCTION',
    hermesModel: process.env.HERMES_MODEL || 'hermes3:8b',
    apiPrefix: '/api/v1',
  });

  console.log('');
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║     Co-Work Cloud ERP — Backend Server          ║');
  console.log('╠══════════════════════════════════════════════════╣');
  console.log(`║  🌐 URL:          http://0.0.0.0:${PORT}            ║`);
  console.log(`║  📦 Environment:  ${(isSandboxEnvironment ? 'SANDBOX' : 'PRODUCTION').padEnd(29)}║`);
  console.log(`║  🤖 Hermes Model: ${(process.env.HERMES_MODEL || 'hermes3:8b').padEnd(29)}║`);
  console.log(`║  🛣️  API Prefix:   /api/v1${' '.repeat(22)}║`);
  console.log('╚══════════════════════════════════════════════════╝');
  console.log('');
});

export default app;

