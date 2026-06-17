/**
 * Application Constants
 *
 * Centralised, app-wide configuration constants.  Import from here rather
 * than scattering magic numbers across modules.
 */

/** Display / service name for logging and diagnostics. */
export const APP_NAME = 'co-work-cloud-erp';

/** Default number of documents returned per page when no `limit` is given. */
export const DEFAULT_PAGE_SIZE = 20;

/** Absolute upper-bound for the `limit` query parameter. */
export const MAX_PAGE_SIZE = 100;

/** Maximum allowed request body size for Express JSON parser. */
export const MAX_JSON_SIZE = '10mb';

/** Sliding window duration for the global rate limiter (15 minutes). */
export const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

/** Maximum number of requests allowed within a single rate-limit window. */
export const RATE_LIMIT_MAX = 100;

/** Default timeout when calling the Hermes notification service (ms). */
export const HERMES_TIMEOUT_MS = 30_000;

/** Tenant-ID prefix that identifies sandbox / development tenants. */
export const SANDBOX_TENANT_PREFIX = 'dev_';
