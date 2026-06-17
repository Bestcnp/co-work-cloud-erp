/**
 * Async Handler
 *
 * Wraps an async Express route handler so that rejected promises are
 * automatically forwarded to the Express error-handling middleware via
 * `next(err)`.  Without this wrapper every async handler would need its
 * own try/catch block.
 *
 * Usage:
 *   import { asyncHandler } from '../lib/async-handler.js';
 *
 *   router.get('/items', asyncHandler(async (req, res) => {
 *     const items = await fetchItems();
 *     res.json(items);
 *   }));
 */

import type { Request, Response, NextFunction } from 'express';

/**
 * Wrap an async route handler so promise rejections reach Express's
 * global error handler.
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
}
