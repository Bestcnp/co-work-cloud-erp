/**
 * Cursor-Based Pagination Helpers
 *
 * Provides types and utilities for Firestore-style cursor-based pagination.
 * Cursor-based pagination is preferred over offset-based pagination because
 * it avoids the "shifted results" problem and performs better on large
 * collections.
 *
 * Usage:
 *   const params = parsePaginationQuery(req.query);
 *   // ... fetch params.limit + 1 docs from Firestore ...
 *   const response = buildPaginatedResponse(docs, params, (d) => d.id);
 *   res.json(response);
 */

import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '../config/constants.js';

// ────────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────────

/** Parsed pagination parameters from the client query string. */
export interface PaginationParams {
  /** Number of documents to return (clamped to 1..100). */
  limit: number;
  /** Opaque cursor string pointing at the last document of the previous page. */
  cursor?: string;
  /** Direction of traversal relative to the cursor. */
  direction: 'next' | 'prev';
}

/** Envelope returned to clients for paginated endpoints. */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    hasMore: boolean;
    nextCursor: string | null;
    prevCursor: string | null;
  };
}

// ────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────

/**
 * Parse and sanitise raw query-string values into {@link PaginationParams}.
 *
 * @param query - Typically `req.query` from Express.
 */
export function parsePaginationQuery(
  query: Record<string, unknown>,
): PaginationParams {
  const rawLimit = Number(query.limit);
  const limit = Number.isFinite(rawLimit)
    ? Math.min(Math.max(rawLimit, 1), MAX_PAGE_SIZE)
    : DEFAULT_PAGE_SIZE;

  const cursor =
    typeof query.cursor === 'string' && query.cursor.length > 0
      ? query.cursor
      : undefined;

  const direction =
    query.direction === 'prev' ? 'prev' : 'next';

  return { limit, cursor, direction };
}

/**
 * Build a {@link PaginatedResponse} from a list of documents.
 *
 * **Convention**: callers should fetch `limit + 1` documents from the data
 * source.  If `data.length > limit` the extra document proves there is a
 * next page and is sliced off before returning.
 *
 * @param data      - Documents fetched from the data source (may contain one
 *                    extra document used to determine `hasMore`).
 * @param params    - The pagination parameters that produced this page.
 * @param getDocId  - Accessor that extracts a stable, unique identifier from
 *                    a document (used as cursor value).
 */
export function buildPaginatedResponse<T>(
  data: T[],
  params: PaginationParams,
  getDocId: (item: T) => string,
): PaginatedResponse<T> {
  const hasMore = data.length > params.limit;

  // Trim the probe document if present.
  const page = hasMore ? data.slice(0, params.limit) : data;

  const nextCursor =
    hasMore && page.length > 0
      ? getDocId(page[page.length - 1])
      : null;

  const prevCursor =
    params.cursor && page.length > 0
      ? getDocId(page[0])
      : null;

  return {
    data: page,
    pagination: {
      hasMore,
      nextCursor,
      prevCursor,
    },
  };
}
