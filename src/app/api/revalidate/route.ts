import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { secret?: string; path?: string };
    const configuredSecret = process.env.REVALIDATE_SECRET;

    if (!configuredSecret || !body.secret || body.secret !== configuredSecret) {
      return NextResponse.json({ success: false, error: 'Invalid secret' }, { status: 401 });
    }

    if (!body.path) {
      return NextResponse.json({ success: false, error: 'Missing path' }, { status: 400 });
    }

    revalidatePath(body.path);
    return NextResponse.json({ success: true, revalidated: true, path: body.path });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: (err as Error)?.message || 'Invalid payload' },
      { status: 400 }
    );
  }
}
