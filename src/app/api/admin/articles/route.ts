import { NextRequest } from 'next/server';
import { GET as getArticles, POST as createArticle } from '@/app/api/articles/route';

/**
 * GET /api/admin/articles
 * Admin endpoint for querying articles.
 */
export async function GET(req: NextRequest) {
  return getArticles(req);
}

/**
 * POST /api/admin/articles
 * Admin endpoint for creating articles.
 */
export async function POST(req: NextRequest) {
  return createArticle(req);
}
