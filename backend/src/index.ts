/**
 * Co-Work Cloud ERP — Backend Entry Point
 *
 * Express server with Firebase, Hermes AI, and multi-tenant middleware.
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { DatabaseRouter } from './config/database-router.js';
import healthRoutes from './routes/health.routes.js';

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

// ============================================================
// Routes — Public (no auth)
// ============================================================
app.use('/health', healthRoutes);

// ============================================================
// Routes — Protected (auth required)
// Future routes will be mounted here with requireAuth middleware:
//
// import { requireAuth, requireTenantAccess } from './middlewares/auth.middleware.js';
// app.use('/api', requireAuth);
// app.use('/api/tenants/:tenantId', requireAuth, requireTenantAccess);
// ============================================================

// ============================================================
// Error Handling
// ============================================================
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error('[Server] Unhandled error:', err);
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message:
        process.env.NODE_ENV === 'development'
          ? err.message
          : 'An unexpected error occurred.',
    });
  },
);

// ============================================================
// Start Server
// ============================================================
const PORT = parseInt(process.env.PORT || '5001', 10);

app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║     Co-Work Cloud ERP — Backend Server          ║');
  console.log('╠══════════════════════════════════════════════════╣');
  console.log(`║  🌐 URL:          http://0.0.0.0:${PORT}            ║`);
  console.log(`║  📦 Environment:  ${(isSandboxEnvironment ? 'SANDBOX' : 'PRODUCTION').padEnd(29)}║`);
  console.log(`║  🤖 Hermes Model: ${(process.env.HERMES_MODEL || 'hermes3:8b').padEnd(29)}║`);
  console.log('╚══════════════════════════════════════════════════╝');
  console.log('');
});

export default app;
