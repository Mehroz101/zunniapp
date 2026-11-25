import crypto from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { getCanonicalSiteUrl } from '@/lib/seo';
import { getAllCanonicalSitemapUrls } from '@/lib/seo/sitemap-data';

export interface SeoSubmissionEngineResult {
  engine: 'indexnow' | 'google_search_console';
  status: 'submitted' | 'skipped' | 'failed';
  httpStatus?: number;
  detail: string;
}

export interface SeoSubmissionSummary {
  siteUrl: string;
  sitemapUrl: string;
  rssUrl: string;
  submittedUrlsCount: number;
  revalidatedPaths: string[];
  results: SeoSubmissionEngineResult[];
}

function normalizeUrlList(urls: string[], siteUrl: string): string[] {
  const unique = new Set<string>();
  const siteHost = new URL(siteUrl).hostname;

  for (const raw of urls) {
    if (!raw || typeof raw !== 'string') continue;
    const trimmed = raw.trim();
    if (!trimmed) continue;

    let absolute = trimmed;
    if (trimmed.startsWith('/')) {
      absolute = `${siteUrl}${trimmed}`;
    }

    try {
      const parsed = new URL(absolute);
      if (parsed.hostname === siteHost) {
        unique.add(parsed.toString());
      }
    } catch {
      // Ignore malformed URLs
    }
  }
  return Array.from(unique);
}

async function submitToIndexNow(
  siteUrl: string,
  urlList: string[]
): Promise<SeoSubmissionEngineResult> {
  const key = (process.env.INDEXNOW_KEY || '').trim();
  if (!key) {
    return {
      engine: 'indexnow',
      status: 'skipped',
      detail: 'Set INDEXNOW_KEY env var to enable instant IndexNow push (Bing, Yandex, Naver).',
    };
  }

  if (urlList.length === 0) {
    return {
      engine: 'indexnow',
      status: 'skipped',
      detail: 'No matching canonical URLs supplied for IndexNow submission.',
    };
  }

  const host = new URL(siteUrl).hostname;
  const keyLocation = `${siteUrl}/seo/indexnow-key.txt`;

  // IndexNow API accepts up to 10,000 URLs per POST request
  const batch = urlList.slice(0, 10000);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host,
        key,
        keyLocation,
        urlList: batch,
      }),
      signal: controller.signal,
    });

    if (res.ok || res.status === 202) {
      return {
        engine: 'indexnow',
        status: 'submitted',
        httpStatus: res.status,
        detail: `Submitted ${batch.length} canonical URL(s) to IndexNow (${res.status}).`,
      };
    }

    const bodyText = await res.text().catch(() => '');
    return {
      engine: 'indexnow',
      status: 'failed',
      httpStatus: res.status,
      detail: `IndexNow responded ${res.status}${bodyText ? `: ${bodyText.slice(0, 140)}` : ''}`,
    };
  } catch (err) {
    return {
      engine: 'indexnow',
      status: 'failed',
      detail: (err as Error)?.message || 'IndexNow request failed',
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

function getGoogleServiceAccountCredentials(): { clientEmail: string; privateKey: string } | null {
  const rawJson = (process.env.GOOGLE_SERVICE_ACCOUNT_JSON || '').trim();
  if (rawJson) {
    try {
      const parsed = JSON.parse(rawJson) as { client_email?: string; private_key?: string };
      if (parsed.client_email && parsed.private_key) {
        return {
          clientEmail: parsed.client_email.trim(),
          privateKey: parsed.private_key.replace(/\\n/g, '\n'),
        };
      }
    } catch {
      // Fallback to individual vars
    }
  }

  const clientEmail = (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '').trim();
  const privateKey = (process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || '').replace(/\\n/g, '\n').trim();
  if (clientEmail && privateKey) {
    return { clientEmail, privateKey };
  }

  return null;
}

function createSignedJwt(clientEmail: string, privateKey: string, scope: string): string {
  const nowSec = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(
    JSON.stringify({
      iss: clientEmail,
      scope,
      aud: 'https://oauth2.googleapis.com/token',
      exp: nowSec + 3600,
      iat: nowSec,
    })
  ).toString('base64url');

  const unsigned = `${header}.${payload}`;
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(unsigned);
  const signature = signer.sign(privateKey, 'base64url');
  return `${unsigned}.${signature}`;
}

async function submitSitemapToGoogleSearchConsole(
  siteUrl: string,
  sitemapUrl: string
): Promise<SeoSubmissionEngineResult> {
  const creds = getGoogleServiceAccountCredentials();
  if (!creds) {
    return {
      engine: 'google_search_console',
      status: 'skipped',
      detail:
        'Google Search Console auto-submit requires GOOGLE_SERVICE_ACCOUNT_JSON (or EMAIL + PRIVATE_KEY) env vars.',
    };
  }

  const gscSiteProperty = (process.env.GSC_SITE_PROPERTY || `${siteUrl}/`).trim();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const assertion = createSignedJwt(
      creds.clientEmail,
      creds.privateKey,
      'https://www.googleapis.com/auth/webmasters'
    );

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion,
      }),
      signal: controller.signal,
    });

    const tokenData = (await tokenRes.json().catch(() => ({}))) as { access_token?: string; error?: string };
    if (!tokenRes.ok || !tokenData.access_token) {
      return {
        engine: 'google_search_console',
        status: 'failed',
        httpStatus: tokenRes.status,
        detail: `Google OAuth token failed: ${tokenData.error || tokenRes.status}`,
      };
    }

    const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
      gscSiteProperty
    )}/sitemaps/${encodeURIComponent(sitemapUrl)}`;

    const putRes = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
      signal: controller.signal,
    });

    if (putRes.ok || putRes.status === 204) {
      return {
        engine: 'google_search_console',
        status: 'submitted',
        httpStatus: putRes.status,
        detail: `Submitted sitemap (${sitemapUrl}) to Google Search Console for ${gscSiteProperty}.`,
      };
    }

    const errBody = await putRes.text().catch(() => '');
    return {
      engine: 'google_search_console',
      status: 'failed',
      httpStatus: putRes.status,
      detail: `GSC API responded ${putRes.status}${errBody ? `: ${errBody.slice(0, 140)}` : ''}`,
    };
  } catch (err) {
    return {
      engine: 'google_search_console',
      status: 'failed',
      detail: (err as Error)?.message || 'GSC sitemap submission failed',
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Revalidates affected Next.js routes & /sitemap.xml + submits URLs/sitemap
 * to configured search engines (IndexNow and Google Search Console API).
 */
export async function syncAndSubmitSeo(options: {
  urls?: string[];
  pathsToRevalidate?: string[];
  includeFullSitemap?: boolean;
} = {}): Promise<SeoSubmissionSummary> {
  const siteUrl = getCanonicalSiteUrl();
  const sitemapUrl = `${siteUrl}/sitemap.xml`;
  const rssUrl = `${siteUrl}/rss.xml`;

  const revalidateTargets = Array.from(
    new Set(['/', '/blog', '/guides', '/news', '/glossary', '/compare', '/sitemap.xml', '/rss.xml', ...(options.pathsToRevalidate || [])])
  );

  for (const p of revalidateTargets) {
    try {
      if (p.startsWith('/')) revalidatePath(p);
    } catch {
      // Ignore outside request context if applicable
    }
  }

  let candidateUrls = options.urls ? normalizeUrlList(options.urls, siteUrl) : [];
  if (options.includeFullSitemap || candidateUrls.length === 0) {
    const sitemapUrls = await getAllCanonicalSitemapUrls().catch(() => [siteUrl]);
    candidateUrls = Array.from(new Set([...candidateUrls, ...sitemapUrls]));
  }

  const [indexNowResult, gscResult] = await Promise.all([
    submitToIndexNow(siteUrl, candidateUrls),
    submitSitemapToGoogleSearchConsole(siteUrl, sitemapUrl),
  ]);

  return {
    siteUrl,
    sitemapUrl,
    rssUrl,
    submittedUrlsCount: candidateUrls.length,
    revalidatedPaths: revalidateTargets,
    results: [indexNowResult, gscResult],
  };
}
