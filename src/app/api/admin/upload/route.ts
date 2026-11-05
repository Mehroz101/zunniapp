import { NextRequest, NextResponse } from 'next/server';
import { POST as handleMediaUpload } from '@/app/api/images/route';

/**
 * POST /api/admin/upload
 * Admin alias for media uploads directly into MongoDB binary buffer storage.
 */
export async function POST(req: NextRequest) {
  return handleMediaUpload(req);
}
