import { NextRequest } from 'next/server';
import {
  GET as getArticleById,
  PUT as updateArticleById,
  DELETE as deleteArticleById,
} from '@/app/api/articles/[id]/route';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/admin/articles/[id]
 */
export async function GET(req: NextRequest, context: RouteContext) {
  return getArticleById(req, context);
}

/**
 * PUT /api/admin/articles/[id]
 */
export async function PUT(req: NextRequest, context: RouteContext) {
  return updateArticleById(req, context);
}

/**
 * DELETE /api/admin/articles/[id]
 */
export async function DELETE(req: NextRequest, context: RouteContext) {
  return deleteArticleById(req, context);
}
