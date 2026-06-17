/**
 * Firestore Collection Path Helpers
 *
 * Thin wrappers around the Firestore SDK that encode the multi-tenant
 * collection hierarchy:
 *
 *   tenants/{tenantId}/{collection}/{docId}   — tenant-scoped data
 *   {collection}/{docId}                      — platform-wide data
 *
 * By funnelling all path construction through these helpers we avoid
 * hard-coding collection strings across the codebase and make it trivial
 * to refactor the data model later.
 */

import type {
  CollectionReference,
  DocumentReference,
} from 'firebase-admin/firestore';
import { db } from '../config/firebase.js';

/**
 * Return a reference to a tenant-scoped sub-collection.
 *
 * Resolves to: `tenants/{tenantId}/{collection}`
 */
export function tenantCollection(
  tenantId: string,
  collection: string,
): CollectionReference {
  return db.collection('tenants').doc(tenantId).collection(collection);
}

/**
 * Return a reference to a specific document inside a tenant-scoped
 * sub-collection.
 *
 * Resolves to: `tenants/{tenantId}/{collection}/{docId}`
 */
export function tenantDoc(
  tenantId: string,
  collection: string,
  docId: string,
): DocumentReference {
  return tenantCollection(tenantId, collection).doc(docId);
}

/**
 * Return a reference to a platform-level (non-tenant) collection.
 *
 * Resolves to: `{collection}`
 */
export function platformCollection(collection: string): CollectionReference {
  return db.collection(collection);
}

/**
 * Generate a random Firestore document ID without creating a document.
 *
 * Uses Firestore's built-in ID generator for guaranteed uniqueness.
 */
export function generateId(): string {
  return db.collection('_').doc().id;
}
