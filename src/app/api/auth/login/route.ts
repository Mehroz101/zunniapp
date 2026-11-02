import { NextResponse } from 'next/server';
import {
  MASTER_ADMIN_CREDENTIALS,
  ADMIN_COOKIE_NAME,
  createAdminSessionToken,
} from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const trimmedEmail = String(email).trim().toLowerCase();
    const targetEmail = MASTER_ADMIN_CREDENTIALS.email.trim().toLowerCase();

    if (trimmedEmail !== targetEmail || String(password) !== MASTER_ADMIN_CREDENTIALS.password) {
      return NextResponse.json(
        { success: false, error: 'Invalid administrator credentials. Access denied.' },
        { status: 401 }
      );
    }

    // Generate signed JWT session
    const token = await createAdminSessionToken(trimmedEmail);

    const isProd = process.env.NODE_ENV === 'production';
    const response = NextResponse.json({
      success: true,
      user: {
        email: trimmedEmail,
        role: 'admin',
      },
    });

    // Set signed HTTP-Only session cookie
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Authentication failed' },
      { status: 500 }
    );
  }
}
