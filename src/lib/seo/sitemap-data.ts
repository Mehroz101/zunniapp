import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { contentTypeToFormatKey, getArticlePublicPath, getCmsArticles, type CmsFormatKey } from '@/lib/cms';
import { CALCULATORS_REGISTRY } from '@/lib/config/calculators';
import { getCanonicalSiteUrl } from '@/lib/seo';
import { getAllTools } from '@/lib/tools/registry';

const FALLBACK_AI_CATEGORY_SLUGS = ['coding', 'text', 'image', 'writing', 'seo', 'data', 'dev', 'security'];

export async function buildDynamicSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getCanonicalSiteUrl();
  const now = new Date();

  const [publishedTools, activeCategories, cmsArticles] = await Promise.all([
    prisma.tool
      .findMany({
        where: { status: 'PUBLISHED' },
        select: { slug: true, updatedAt: true },
        orderBy: { updatedAt: 'desc' },
      })
      .catch(() => []),
    prisma.toolCategory
      .findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
        orderBy: { displayOrder: 'asc' },
      })
      .catch(() => []),
    getCmsArticles('ALL', 500).catch(() => []),
  ]);

  // Track latest update per editorial hub so Google re-crawls hubs when fresh articles publish
  const latestByFormat: Partial<Record<CmsFormatKey, Date>> = {};
  let latestEditorialDate: Date | undefined;

  for (const art of cmsArticles) {
    if (!art.slug) continue;
    const modDate = new Date(art.updatedAt || art.publishedAt || now);
    if (Number.isNaN(modDate.getTime())) continue;
    const fmt = contentTypeToFormatKey(art.contentType);
    const prev = latestByFormat[fmt];
    if (!prev || modDate > prev) latestByFormat[fmt] = modDate;
    if (!latestEditorialDate || modDate > latestEditorialDate) latestEditorialDate = modDate;
  }

  const deduped = new Map<string, MetadataRoute.Sitemap[number]>();
  const addEntry = (entry: MetadataRoute.Sitemap[number]) => {
    const cleanUrl = entry.url.replace(/\/+$/, '') || `${baseUrl}/`;
    const normalized = cleanUrl === baseUrl ? `${baseUrl}/` : cleanUrl;
    const existing = deduped.get(normalized);
    if (!existing) {
      deduped.set(normalized, { ...entry, url: normalized });
      return;
    }
    const existingPriority = existing.priority ?? 0;
    const nextPriority = entry.priority ?? 0;
    const existingTime = existing.lastModified ? new Date(existing.lastModified).getTime() : 0;
    const nextTime = entry.lastModified ? new Date(entry.lastModified).getTime() : 0;
    deduped.set(normalized, {
      ...existing,
      priority: Math.max(existingPriority, nextPriority),
      lastModified: nextTime > existingTime ? entry.lastModified : existing.lastModified,
    });
  };

  // 1. Core Static Pages & Hubs
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: latestEditorialDate || now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/tools`, lastModified: now, changeFrequency: 'daily', priority: 0.95 },
    { url: `${baseUrl}/ai-tools`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/toolkits`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/calculators`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/calculators/finance`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/calculators/scientific`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: latestEditorialDate || now, changeFrequency: 'daily', priority: 0.95 },
    { url: `${baseUrl}/guides`, lastModified: latestByFormat.guides || now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/news`, lastModified: latestByFormat.news || now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/glossary`, lastModified: latestByFormat.glossary || now, changeFrequency: 'daily', priority: 0.85 },
    { url: `${baseUrl}/compare`, lastModified: latestByFormat.compare || now, changeFrequency: 'daily', priority: 0.85 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];
  staticRoutes.forEach(addEntry);

  // 2. Canonical Utility Tool Routes (/tools/[slug])
  getAllTools().forEach((tool) => {
    if (!tool.slug) return;
    addEntry({
      url: `${baseUrl}/tools/${tool.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    });
  });

  // DB-published tools deduplicated onto the single canonical /tools/[slug] URL
  publishedTools.forEach((tool) => {
    if (!tool.slug) return;
    addEntry({
      url: `${baseUrl}/tools/${tool.slug}`,
      lastModified: tool.updatedAt ? new Date(tool.updatedAt) : now,
      changeFrequency: 'weekly',
      priority: 0.85,
    });
  });

  // 3. Canonical Calculator Routes (/calculators/[slug])
  Object.values(CALCULATORS_REGISTRY).forEach((calc) => {
    if (!calc.slug) return;
    addEntry({
      url: `${baseUrl}/calculators/${calc.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    });
  });

  // 4. Category Hub Routes (/ai-tools/[category])
  FALLBACK_AI_CATEGORY_SLUGS.forEach((slug) => {
    addEntry({
      url: `${baseUrl}/ai-tools/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.75,
    });
  });
  activeCategories.forEach((cat) => {
    if (!cat.slug) return;
    addEntry({
      url: `${baseUrl}/ai-tools/${cat.slug}`,
      lastModified: cat.updatedAt ? new Date(cat.updatedAt) : now,
      changeFrequency: 'weekly',
      priority: 0.75,
    });
  });

  // 5. Dynamic Editorial Articles (/blog, /guides, /news, /glossary, /compare)
  cmsArticles.forEach((art) => {
    if (!art.slug) return;
    const modDate = new Date(art.updatedAt || art.publishedAt || now);
    addEntry({
      url: `${baseUrl}${getArticlePublicPath(art.slug, art.contentType)}`,
      lastModified: Number.isNaN(modDate.getTime()) ? now : modDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    });
  });

  return Array.from(deduped.values());
}

export async function getAllCanonicalSitemapUrls(): Promise<string[]> {
  const entries = await buildDynamicSitemapEntries();
  return entries.map((entry) => entry.url);
}
