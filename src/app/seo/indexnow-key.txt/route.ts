import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Serves the IndexNow verification key file referenced as `keyLocation`
 * during automated Bing/Yandex/Naver search engine submissions.
 */
export async function GET() {
  const key = (process.env.INDEXNOW_KEY || '').trim();
  if (!key) {
    return new NextResponse('INDEXNOW_KEY is not configured in runtime environment.', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  return new NextResponse(key, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
}
