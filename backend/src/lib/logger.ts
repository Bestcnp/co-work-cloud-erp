/**
 * Structured JSON Logger
 *
 * Outputs structured JSON log entries suitable for Cloud Run, Cloud Functions,
 * and Google Cloud Logging ingestion.  In development mode (`NODE_ENV=development`)
 * output is pretty-printed with 2-space indentation for readability.
 *
 * Usage:
 *   import { logger } from '../lib/logger.js';
 *   logger.info('User created', { uid: '123', tenantId: 'acme' });
 */

/** Log severity levels recognised by Cloud Logging. */
type LogLevel = 'info' | 'warn' | 'error' | 'debug';

/** Shape of every structured log entry. */
interface LogEntry {
  level: LogLevel;
  message: string;
  service: string;
  timestamp: string;
  [key: string]: unknown;
}

const SERVICE_NAME = 'erp-backend';
const isDev = process.env.NODE_ENV === 'development';

/**
 * Build and emit a structured log entry.
 *
 * @param level   - Severity level
 * @param message - Human-readable message
 * @param meta    - Arbitrary key/value metadata to attach
 */
function emit(level: LogLevel, message: string, meta?: Record<string, unknown>): void {
  const entry: LogEntry = {
    level,
    message,
    service: SERVICE_NAME,
    timestamp: new Date().toISOString(),
    ...meta,
  };

  const serialised = isDev
    ? JSON.stringify(entry, null, 2)
    : JSON.stringify(entry);

  switch (level) {
    case 'error':
      console.error(serialised);
      break;
    case 'warn':
      console.warn(serialised);
      break;
    case 'info':
    case 'debug':
    default:
      console.log(serialised);
      break;
  }
}

/**
 * Application logger.
 *
 * Every method accepts a human-readable `message` and an optional `meta`
 * bag of structured data that will be spread into the log entry.
 */
export const logger = {
  info:  (message: string, meta?: Record<string, unknown>) => emit('info',  message, meta),
  warn:  (message: string, meta?: Record<string, unknown>) => emit('warn',  message, meta),
  error: (message: string, meta?: Record<string, unknown>) => emit('error', message, meta),
  debug: (message: string, meta?: Record<string, unknown>) => emit('debug', message, meta),
} as const;
