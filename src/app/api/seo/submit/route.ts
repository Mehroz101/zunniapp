import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from '@/lib/auth';
import { getCanonicalSiteUrl } from '@/lib/seo';
import { getAllCanonicalSitemapUrls } from '@/lib/seo/sitemap-data';
import { syncAndSubmitSeo } from '@/lib/seo/submit';

export const dynamic = 'force-dynamic';

function isAuthorizedSecret(request: NextRequest, bodySecret?: string): boolean {
  const configuredSecret = (process.env.REVALIDATE_SECRET || '').trim();
  if (!configuredSecret) return false;
  const authHeader = request.headers.get('authorization') || '';
  const bearer = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  return bodySecret === configuredSecret || bearer === configuredSecret;
}

export async function GET() {
  const siteUrl = getCanonicalSiteUrl();
  const urls = await getAllCanonicalSitemapUrls().catch(() => []);
  const gscConfigured = Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON ||
      (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY)
  );

  return NextResponse.json({
    success: true,
    siteUrl,
    sitemapUrl: `${siteUrl}/sitemap.xml`,
    rssUrl: `${siteUrl}/rss.xml`,
    robotsUrl: `${siteUrl}/robots.txt`,
    indexNowKeyUrl: `${siteUrl}/seo/indexnow-key.txt`,
    totalCanonicalUrls: urls.length,
    indexNowConfigured: Boolean((process.env.INDEXNOW_KEY || '').trim()),
    gscConfigured,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      secret?: string;
      urls?: string[];
      paths?: string[];
      includeFullSitemap?: boolean;
    };

    const cookieToken = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const { valid: validSession } = await verifyAdminSessionToken(cookieToken);

    if (!validSession && !isAuthorizedSecret(request, body.secret)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: invalid session or REVALIDATE_SECRET' },
        { status: 401 }
      );
    }

    const summary = await syncAndSubmitSeo({
      urls: Array.isArray(body.urls) ? body.urls : undefined,
      pathsToRevalidate: Array.isArray(body.paths) ? body.paths : undefined,
      includeFullSitemap: body.includeFullSitemap ?? (!body.urls || body.urls.length === 0),
    });

    return NextResponse.json({ success: true, ...summary });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: (err as Error)?.message || 'SEO submission failed' },
      { status: 500 }
    );
  }
}
