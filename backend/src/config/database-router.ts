/**
 * Database Router
 *
 * Manages database connection initialization and tenant namespace routing.
 * Provides singleton access to Firebase services and sandbox-aware tenant prefixing.
 */

import { app, auth, db, isSandbox } from './firebase.js';
import type { App, Auth, Firestore } from './firebase.js';

interface DatabaseConnection {
  app: App;
  db: Firestore;
  auth: Auth;
  isSandboxEnvironment: boolean;
}

let initialized = false;

export class DatabaseRouter {
  /**
   * Initialize the database connection (singleton).
   * Safe to call multiple times — only initializes once.
   */
  static initializeDatabaseConnection(): DatabaseConnection {
    if (!initialized) {
      console.log('[DatabaseRouter] Connection initialized');
      console.log(`[DatabaseRouter] Environment: ${isSandbox ? 'SANDBOX' : 'PRODUCTION'}`);
      initialized = true;
    }

    return { app, db, auth, isSandboxEnvironment: isSandbox };
  }

  /**
   * Get the tenant namespace with environment prefix.
   * In development/sandbox mode, tenant IDs are prefixed with 'dev_'
   * to prevent accidental production data access.
   */
  static getTenantNamespace(baseTenantId: string): string {
    if (isSandbox && !baseTenantId.startsWith('dev_')) {
      return `dev_${baseTenantId}`;
    }
    return baseTenantId;
  }

  /**
   * Check if running in sandbox mode.
   */
  static isSandbox(): boolean {
    return isSandbox;
  }
}
