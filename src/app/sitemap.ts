import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { CALCULATORS_REGISTRY } from '@/lib/config/calculators';
import { getAllTools } from '@/lib/tools/registry';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rawBase = process.env.NEXT_PUBLIC_SITE_URL || 'https://freetoolsstore.online';
  const baseUrl = rawBase.endsWith('/') ? rawBase.slice(0, -1) : rawBase;
  const now = new Date();

  // 1. Static Core Routes (Priority: 1.0, daily changeFreq)
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/ai-tools`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/calculators`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

  // Dynamic Calculators: /calculators/${calc.slug} (Priority: 0.8)
  const calculatorRoutes: MetadataRoute.Sitemap = Object.values(CALCULATORS_REGISTRY).map((calc) => ({
    url: `${baseUrl}/calculators/${calc.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Dynamic Developer & Compiler Tools: /tools/${tool.slug} (Priority: 0.8)
  const registryToolRoutes: MetadataRoute.Sitemap = getAllTools().map((tool) => ({
    url: `${baseUrl}/tools/${tool.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  try {
    // 2. Fetch dynamic published tools, active categories, and published blog posts
    const [publishedTools, activeCategories, publishedPosts] = await Promise.all([
      prisma.tool.findMany({
        where: { status: 'PUBLISHED' },
        select: {
          slug: true,
          updatedAt: true,
          category: {
            select: {
              slug: true,
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.toolCategory.findMany({
        where: { isActive: true },
        select: {
          slug: true,
          updatedAt: true,
        },
        orderBy: { displayOrder: 'asc' },
      }),
      prisma.post.findMany({
        where: { status: 'PUBLISHED' },
        select: {
          slug: true,
          updatedAt: true,
        },
        orderBy: { updatedAt: 'desc' },
      }),
    ]);

    // Dynamic Tools: /ai-tools/${tool.category.slug}/${tool.slug} (Priority: 0.8)
    const toolRoutes: MetadataRoute.Sitemap = publishedTools
      .filter((tool) => Boolean(tool.slug && tool.category?.slug))
      .map((tool) => ({
        url: `${baseUrl}/ai-tools/${tool.category.slug}/${tool.slug}`,
        lastModified: tool.updatedAt ? new Date(tool.updatedAt) : now,
        changeFrequency: 'weekly',
        priority: 0.8,
      }));

    // Dynamic Categories: /ai-tools/${category.slug} (Priority: 0.7)
    const categoryRoutes: MetadataRoute.Sitemap = activeCategories
      .filter((cat) => Boolean(cat.slug))
      .map((cat) => ({
        url: `${baseUrl}/ai-tools/${cat.slug}`,
        lastModified: cat.updatedAt ? new Date(cat.updatedAt) : now,
        changeFrequency: 'weekly',
        priority: 0.7,
      }));

    // Dynamic Blog Posts: /blog/${post.slug} (Priority: 0.7)
    const postRoutes: MetadataRoute.Sitemap = publishedPosts
      .filter((post) => Boolean(post.slug))
      .map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.updatedAt ? new Date(post.updatedAt) : now,
        changeFrequency: 'weekly',
        priority: 0.7,
      }));

    return [...staticRoutes, ...registryToolRoutes, ...calculatorRoutes, ...toolRoutes, ...categoryRoutes, ...postRoutes];
  } catch (error) {
    console.warn('[Sitemap] Database fetch failed or offline, returning fallback static routes:', error);
    return [...staticRoutes, ...registryToolRoutes, ...calculatorRoutes];
  }
}
