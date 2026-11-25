import { prisma } from './prisma';
import { connectToDatabase } from './db/mongodb';
import { Article } from '@/models/Article';
import { slugify } from './utils';

export type CmsContentType = 'BLOG' | 'GUIDE' | 'NEWS' | 'GLOSSARY' | 'COMPARISON';
export type CmsFormatKey = 'blog' | 'guides' | 'news' | 'glossary' | 'compare';

export interface CmsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string | null;
  categoryName: string;
  categoryId?: string | null;
  authorName: string;
  contentType: CmsContentType;
  readingTimeMins: number;
  viewCount: number;
  tags: string[];
  canonicalUrl?: string | null;
  seoMeta: {
    title?: string;
    description?: string;
    canonical?: string;
    ogImage?: string;
    keywords?: string[];
  };
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export function normalizeContentType(raw?: string | null): CmsContentType {
  const upper = String(raw || 'BLOG').trim().toUpperCase();
  if (upper === 'COMPARE' || upper === 'COMPARISON') return 'COMPARISON';
  if (upper === 'GUIDE' || upper === 'GUIDES') return 'GUIDE';
  if (upper === 'NEWS') return 'NEWS';
  if (upper === 'GLOSSARY') return 'GLOSSARY';
  return 'BLOG';
}

export function contentTypeToFormatKey(contentType?: string | null): CmsFormatKey {
  const ct = normalizeContentType(contentType);
  if (ct === 'GUIDE') return 'guides';
  if (ct === 'NEWS') return 'news';
  if (ct === 'GLOSSARY') return 'glossary';
  if (ct === 'COMPARISON') return 'compare';
  return 'blog';
}

export function formatKeyToContentType(format: CmsFormatKey): CmsContentType {
  if (format === 'guides') return 'GUIDE';
  if (format === 'news') return 'NEWS';
  if (format === 'glossary') return 'GLOSSARY';
  if (format === 'compare') return 'COMPARISON';
  return 'BLOG';
}

export function getArticlePublicPath(slug: string, contentType?: string | null): string {
  const key = contentTypeToFormatKey(contentType);
  return `/${key}/${slug}`;
}

function getDashboardApiBase(): string {
  return (
    process.env.DASHBOARD_API_URL ||
    process.env.NEXT_PUBLIC_DASHBOARD_URL ||
    'https://aiiseverythingdashboard.vercel.app'
  ).replace(/\/$/, '');
}

async function queryD1Direct<T = Record<string, any>>(
  sql: string,
  params: (string | number | boolean | null)[] = []
): Promise<T[] | null> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID;
  const token = process.env.CLOUDFLARE_D1_API_TOKEN;
  if (!accountId || !databaseId || !token) return null;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sql, params }),
        cache: 'no-store',
        signal: controller.signal,
      }
    );
    clearTimeout(timeoutId);
    if (!res.ok) return null;
    const json = (await res.json()) as { success?: boolean; result?: Array<{ results?: T[] }> };
    if (!json.success) return null;
    return json.result?.[0]?.results || [];
  } catch {
    return null;
  }
}

function mapRawArticle(raw: Record<string, any>): CmsArticle {
  const content = String(raw.content || raw.contentHtml || raw.contentMd || '');
  const plainText = content.replace(/<[^>]*>/g, ' ').trim();
  const title = String(raw.title || 'Untitled Article');
  const excerpt =
    String(raw.excerpt || '').trim() ||
    (plainText.length > 155 ? `${plainText.slice(0, 155)}...` : plainText) ||
    title;

  const categoryName =
    (typeof raw.category === 'string' && raw.category) ||
    raw.categoryName ||
    raw.contentCategory?.name ||
    (Array.isArray(raw.categories) && raw.categories[0]) ||
    'AI News';

  const contentType = normalizeContentType(raw.contentType || raw.type);
  const coverImage = raw.coverImage || raw.coverImageUrl || raw.ogImage || raw.featuredImage || null;
  const wordCount = plainText.split(/\s+/).filter(Boolean).length;
  const readingTimeMins =
    Number(raw.readingTimeMins || raw.readingTime) > 0
      ? Number(raw.readingTimeMins || raw.readingTime)
      : Math.max(1, Math.ceil(wordCount / 200));

  const createdAt = raw.createdAt ? new Date(raw.createdAt).toISOString() : new Date().toISOString();
  const publishedAt = raw.publishedAt ? new Date(raw.publishedAt).toISOString() : createdAt;
  const updatedAt = raw.updatedAt ? new Date(raw.updatedAt).toISOString() : publishedAt;

  const tags: string[] = Array.isArray(raw.tags)
    ? raw.tags.map((t: any) => (typeof t === 'string' ? t : t?.name || '')).filter(Boolean)
    : [];

  const seoRaw = (raw.seoMeta || raw.seo || {}) as Record<string, any>;

  return {
    id: String(raw.id || raw._id?.toString?.() || raw.slug || ''),
    title,
    slug: String(raw.slug || ''),
    excerpt,
    content,
    coverImage,
    categoryName: String(categoryName),
    categoryId: raw.categoryId ? String(raw.categoryId) : null,
    authorName: raw.author?.name || raw.authorName || 'TOOLty Editorial',
    contentType,
    readingTimeMins,
    viewCount: Number(raw.viewCount) || 0,
    tags,
    canonicalUrl: raw.canonicalUrl || seoRaw.canonicalUrl || seoRaw.canonical || null,
    seoMeta: {
      title: seoRaw.metaTitle || seoRaw.title,
      description: seoRaw.metaDescription || seoRaw.description,
      canonical: seoRaw.canonicalUrl || seoRaw.canonical || raw.canonicalUrl,
      ogImage: seoRaw.ogImage || coverImage || undefined,
      keywords: Array.isArray(seoRaw.keywords) ? seoRaw.keywords : undefined,
    },
    publishedAt,
    createdAt,
    updatedAt,
  };
}

/**
 * Fetches a single published article by slug (or ID) from:
 * 1) Direct Cloudflare D1 (if credentials present in runtime env)
 * 2) Vercel Dashboard public D1 feed (/api/public/posts/[slug])
 * 3) Local MongoDB (Prisma Post + Mongoose Article)
 * 4) Legacy backend API fallback
 */
export async function getCmsArticleBySlug(slug: string): Promise<CmsArticle | null> {
  const cleanSlug = decodeURIComponent(slug).trim();

  // 1. Direct Cloudflare D1 (if configured)
  const d1Rows = await queryD1Direct<Record<string, any>>(
    `SELECT a.*, c.name as categoryName
     FROM Article a
     LEFT JOIN Category c ON a.categoryId = c.id
     WHERE (LOWER(a.slug) = LOWER(?) OR a.id = ?) AND UPPER(a.status) = 'PUBLISHED'
     LIMIT 1;`,
    [cleanSlug, cleanSlug]
  );
  if (d1Rows && d1Rows.length > 0) {
    return mapRawArticle(d1Rows[0]);
  }

  // 2. Dashboard Public D1 Feed (works automatically without storing D1 secrets on Hostinger)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);
    const res = await fetch(
      `${getDashboardApiBase()}/api/public/posts/${encodeURIComponent(cleanSlug)}`,
      { cache: 'no-store', signal: controller.signal }
    );
    clearTimeout(timeoutId);
    if (res.ok) {
      const json = (await res.json()) as { success?: boolean; data?: Record<string, any> };
      if (json.success && json.data) {
        return mapRawArticle(json.data);
      }
    }
  } catch (err) {
    console.warn('[CMS] Dashboard public post fetch failed:', (err as Error)?.message);
  }

  // 3. MongoDB Prisma Post fallback
  try {
    const prismaPost =
      (await prisma.post.findFirst({
        where: {
          status: 'PUBLISHED',
          OR: [{ slug: cleanSlug }, { slug: cleanSlug.toLowerCase() }],
        },
        include: { contentCategory: true, author: true },
      })) ||
      (await prisma.post
        .findUnique({
          where: { id: cleanSlug },
          include: { contentCategory: true, author: true },
        })
        .catch(() => null));

    if (prismaPost && prismaPost.status === 'PUBLISHED') {
      return mapRawArticle(prismaPost as unknown as Record<string, any>);
    }
  } catch {
    // Non-fatal fallback
  }

  // 4. MongoDB Mongoose Article fallback (Guides / News studio)
  try {
    await connectToDatabase();
    const doc = (await Article.findOne({
      slug: cleanSlug.toLowerCase(),
      status: 'published',
    }).lean()) as Record<string, any> | null;
    if (doc) {
      return mapRawArticle(doc);
    }
  } catch {
    // Non-fatal fallback
  }

  // 5. Legacy backend API fallback
  if (process.env.NEXT_PUBLIC_API_URL) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '');
      const res = await fetch(`${apiUrl}/posts/${encodeURIComponent(cleanSlug)}`, {
        cache: 'no-store',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const json = (await res.json()) as { success?: boolean; data?: Record<string, any> };
        if (json.success && json.data && (!json.data.status || String(json.data.status).toUpperCase() === 'PUBLISHED')) {
          return mapRawArticle(json.data);
        }
      }
    } catch {
      // Non-fatal
    }
  }

  return null;
}

/**
 * Fetches published articles across D1/Dashboard and MongoDB, optionally filtered by contentType.
 */
export async function getCmsArticles(
  contentType: CmsContentType | 'ALL' = 'ALL',
  limit = 60
): Promise<CmsArticle[]> {
  const results = new Map<string, CmsArticle>();
  const addItem = (item: CmsArticle) => {
    const key = item.slug.toLowerCase();
    if (key && !results.has(key)) {
      results.set(key, item);
    }
  };

  const normalizedType = contentType === 'ALL' ? 'ALL' : normalizeContentType(contentType);

  // 1. Direct D1 (if env vars present)
  let loadedFromD1 = false;
  const d1Sql =
    normalizedType === 'ALL'
      ? `SELECT a.*, c.name as categoryName FROM Article a LEFT JOIN Category c ON a.categoryId = c.id WHERE UPPER(a.status) = 'PUBLISHED' ORDER BY COALESCE(a.publishedAt, a.createdAt) DESC LIMIT ?;`
      : `SELECT a.*, c.name as categoryName FROM Article a LEFT JOIN Category c ON a.categoryId = c.id WHERE UPPER(a.status) = 'PUBLISHED' AND UPPER(COALESCE(a.contentType, 'BLOG')) = ? ORDER BY COALESCE(a.publishedAt, a.createdAt) DESC LIMIT ?;`;
  const d1Params = normalizedType === 'ALL' ? [limit] : [normalizedType, limit];
  const d1Rows = await queryD1Direct<Record<string, any>>(d1Sql, d1Params);
  if (d1Rows) {
    loadedFromD1 = true;
    d1Rows.forEach((r) => addItem(mapRawArticle(r)));
  }

  // 2. Dashboard Public D1 Feed
  if (!loadedFromD1) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);
      const qs = new URLSearchParams({ limit: String(limit) });
      if (normalizedType !== 'ALL') qs.set('contentType', normalizedType);
      const res = await fetch(`${getDashboardApiBase()}/api/public/posts?${qs}`, {
        cache: 'no-store',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const json = (await res.json()) as { success?: boolean; data?: Array<Record<string, any>> };
        if (json.success && Array.isArray(json.data)) {
          json.data.forEach((r) => addItem(mapRawArticle(r)));
        }
      }
    } catch {
      // Non-fatal
    }
  }

  // 3. MongoDB Prisma Posts
  try {
    const prismaPosts = await prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        ...(normalizedType !== 'ALL' ? { contentType: normalizedType } : {}),
      },
      include: { contentCategory: true, author: true },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      take: limit,
    });
    prismaPosts.forEach((p) => addItem(mapRawArticle(p as unknown as Record<string, any>)));
  } catch {
    // Non-fatal
  }

  // 4. MongoDB Mongoose Articles (guide / news)
  if (normalizedType === 'ALL' || normalizedType === 'GUIDE' || normalizedType === 'NEWS') {
    try {
      await connectToDatabase();
      const query: Record<string, any> = { status: 'published' };
      if (normalizedType === 'GUIDE') query.type = 'guide';
      if (normalizedType === 'NEWS') query.type = 'news';
      const docs = (await Article.find(query).sort({ createdAt: -1 }).limit(limit).lean()) as Array<
        Record<string, any>
      >;
      docs.forEach((d) => addItem(mapRawArticle(d)));
    } catch {
      // Non-fatal
    }
  }

  return Array.from(results.values()).slice(0, limit);
}

/**
 * Extracts Markdown (`##`) and HTML (`<h2>`, `<h3>`) headings for Table of Contents.
 */
export function extractArticleHeadings(content: string): Array<{ id: string; text: string; level: number }> {
  const items: Array<{ id: string; text: string; level: number }> = [];
  const seen = new Set<string>();

  const mdRegex = /^(#{2,3})\s+(.+)$/gm;
  let match: RegExpExecArray | null;
  while ((match = mdRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].replace(/[*_`]/g, '').trim();
    const id = slugify(text);
    if (id && !seen.has(id)) {
      seen.add(id);
      items.push({ id, text, level });
    }
  }

  const htmlRegex = /<h([23])[^>]*>(.*?)<\/h\1>/gi;
  while ((match = htmlRegex.exec(content)) !== null) {
    const level = Number(match[1]);
    const text = match[2].replace(/<[^>]*>/g, '').trim();
    const id = slugify(text);
    if (id && !seen.has(id)) {
      seen.add(id);
      items.push({ id, text, level });
    }
  }

  return items;
}
