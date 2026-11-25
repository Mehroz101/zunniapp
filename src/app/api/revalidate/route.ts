import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      secret?: string;
      path?: string;
      paths?: string[];
    };

    const cookieToken = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const { valid: validSession } = await verifyAdminSessionToken(cookieToken);
    const configuredSecret = (process.env.REVALIDATE_SECRET || '').trim();
    const authHeader = request.headers.get('authorization') || '';
    const bearer = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
    const validSecret =
      Boolean(configuredSecret) &&
      (body.secret === configuredSecret || bearer === configuredSecret);

    if (!validSession && !validSecret) {
      return NextResponse.json({ success: false, error: 'Invalid secret' }, { status: 401 });
    }

    const targets = new Set<string>();
    if (body.path && typeof body.path === 'string') targets.add(body.path);
    if (Array.isArray(body.paths)) {
      body.paths.forEach((p) => {
        if (p && typeof p === 'string') targets.add(p);
      });
    }

    if (targets.size === 0) {
      return NextResponse.json({ success: false, error: 'Missing path' }, { status: 400 });
    }

    const revalidated: string[] = [];
    for (const p of targets) {
      if (p.startsWith('/')) {
        revalidatePath(p);
        revalidated.push(p);
      }
    }

    return NextResponse.json({
      success: true,
      revalidated: true,
      path: body.path || revalidated[0],
      paths: revalidated,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: (err as Error)?.message || 'Invalid payload' },
      { status: 400 }
    );
  }
}
