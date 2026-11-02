import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  const { valid, email } = await verifyAdminSessionToken(token);

  if (!valid) {
    return NextResponse.json(
      { authenticated: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      email,
      role: 'admin',
    },
  });
}
