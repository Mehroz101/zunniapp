import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { secret?: string; path?: string };

  if (body.secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ success: false, error: 'Invalid secret' }, { status: 401 });
  }

  if (!body.path) {
    return NextResponse.json({ success: false, error: 'Missing path' }, { status: 400 });
  }

  revalidatePath(body.path);

  return NextResponse.json({ success: true, revalidated: true, path: body.path });
}
