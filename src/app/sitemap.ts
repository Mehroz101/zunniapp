import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { getArticlePublicPath, getCmsArticles } from '@/lib/cms';
import { CALCULATORS_REGISTRY } from '@/lib/config/calculators';
import { getAllTools } from '@/lib/tools/registry';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rawBase = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolty.online';
  const baseUrl = rawBase.endsWith('/') ? rawBase.slice(0, -1) : rawBase;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/ai-tools`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/tools`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/calculators`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/guides`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/news`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/glossary`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/compare`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
  ];

  const calculatorRoutes: MetadataRoute.Sitemap = Object.values(CALCULATORS_REGISTRY).map((calc) => ({
    url: `${baseUrl}/calculators/${calc.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const registryToolRoutes: MetadataRoute.Sitemap = getAllTools().map((tool) => ({
    url: `${baseUrl}/tools/${tool.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const [publishedTools, activeCategories, cmsArticles] = await Promise.all([
    prisma.tool
      .findMany({
        where: { status: 'PUBLISHED' },
        select: { slug: true, updatedAt: true, category: { select: { slug: true } } },
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
    getCmsArticles('ALL', 200).catch(() => []),
  ]);

  const toolRoutes: MetadataRoute.Sitemap = publishedTools
    .filter((tool) => Boolean(tool.slug && tool.category?.slug))
    .map((tool) => ({
      url: `${baseUrl}/ai-tools/${tool.category.slug}/${tool.slug}`,
      lastModified: tool.updatedAt ? new Date(tool.updatedAt) : now,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

  const categoryRoutes: MetadataRoute.Sitemap = activeCategories
    .filter((cat) => Boolean(cat.slug))
    .map((cat) => ({
      url: `${baseUrl}/ai-tools/${cat.slug}`,
      lastModified: cat.updatedAt ? new Date(cat.updatedAt) : now,
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

  const cmsArticleRoutes: MetadataRoute.Sitemap = cmsArticles
    .filter((art) => Boolean(art.slug))
    .map((art) => ({
      url: `${baseUrl}${getArticlePublicPath(art.slug, art.contentType)}`,
      lastModified: art.updatedAt ? new Date(art.updatedAt) : now,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

  return [
    ...staticRoutes,
    ...registryToolRoutes,
    ...calculatorRoutes,
    ...toolRoutes,
    ...categoryRoutes,
    ...cmsArticleRoutes,
  ];
}
