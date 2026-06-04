/**
 * Firebase Admin SDK Configuration
 *
 * Handles initialization for both sandbox (emulator) and production environments.
 * Supports service account JSON, file path, or ADC authentication.
 */

import { initializeApp, cert, applicationDefault, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

// Detect sandbox mode
const isSandbox =
  process.env.NODE_ENV === 'development' ||
  process.env.DEV_SANDBOX_ACTIVE === 'true';

// Configure emulator hosts in sandbox mode
if (isSandbox) {
  process.env.FIRESTORE_EMULATOR_HOST =
    process.env.FIRESTORE_EMULATOR_HOST || 'localhost:8080';
  process.env.FIREBASE_AUTH_EMULATOR_HOST =
    process.env.FIREBASE_AUTH_EMULATOR_HOST || 'localhost:9099';

  console.log('[Firebase] 🧪 Sandbox mode enabled');
  console.log(`[Firebase]    Firestore emulator: ${process.env.FIRESTORE_EMULATOR_HOST}`);
  console.log(`[Firebase]    Auth emulator: ${process.env.FIREBASE_AUTH_EMULATOR_HOST}`);
}

// Initialize Firebase App
function createApp(): App {
  // Option 1: Service account JSON string from env
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
      return initializeApp({ credential: cert(serviceAccount) });
    } catch (error) {
      console.error('[Firebase] Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON:', error);
      throw error;
    }
  }

  // Option 2: Service account file path
  if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    return initializeApp({
      credential: cert(process.env.FIREBASE_SERVICE_ACCOUNT_PATH),
    });
  }

  // Option 3: Sandbox mode — use demo project
  if (isSandbox) {
    return initializeApp({ projectId: 'demo-project' });
  }

  // Option 4: Application Default Credentials
  return initializeApp({ credential: applicationDefault() });
}

const app: App = createApp();
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

/**
 * Set custom claims on a Firebase Auth user for tenant isolation.
 */
async function setTenantCustomClaims(
  uid: string,
  tenantId: string,
  additionalClaims?: Record<string, unknown>,
): Promise<void> {
  await auth.setCustomUserClaims(uid, {
    tenantId,
    ...additionalClaims,
  });
  console.log(`[Firebase] Custom claims set for user ${uid} → tenant ${tenantId}`);
}

export { app, auth, db, isSandbox, setTenantCustomClaims };
export type { App, Auth, Firestore };
