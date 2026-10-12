import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export const revalidate = 3600; // Dynamic ISR revalidation every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rawBase = process.env.NEXT_PUBLIC_SITE_URL || 'https://aiiseverything.com';
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
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

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

    return [...staticRoutes, ...toolRoutes, ...categoryRoutes, ...postRoutes];
  } catch (error) {
    console.warn('[Sitemap] Database fetch failed or offline, returning fallback static routes:', error);
    return staticRoutes;
  }
}
