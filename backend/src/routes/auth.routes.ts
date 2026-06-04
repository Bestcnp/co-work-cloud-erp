/**
 * Auth Routes
 *
 * Handles user registration, profile management, and tenant switching.
 * POST /auth/register — public (no auth)
 * POST /auth/switch-tenant — requires auth
 * GET  /auth/profile — requires auth
 * PUT  /auth/profile — requires auth
 */

import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import {
  registerUser,
  switchTenant,
  getProfile,
  updateProfile,
} from '../controllers/auth.controller.js';

const router = Router();

// Public route — no auth required
router.post('/register', registerUser);

// Protected routes — auth required
router.post('/switch-tenant', requireAuth, switchTenant);
router.get('/profile', requireAuth, getProfile);
router.put('/profile', requireAuth, updateProfile);

export default router;
