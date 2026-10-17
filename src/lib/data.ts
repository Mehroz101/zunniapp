import { prisma } from './prisma';

export interface LiveTool {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  isFeatured: boolean;
  isFree: boolean;
  viewCount: number;
  renderType: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface LiveCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  toolCount: number;
}

export interface LivePost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  readingTimeMins: number;
  publishedAt: Date | null;
  contentType: string;
  category: {
    name: string;
    slug: string;
  };
}

export interface LivePlatformStats {
  toolsCount: number;
  articlesCount: number;
  categoriesCount: number;
}

// ── Default Category Meta Mapping (Icons and Gradients) ──
export const CATEGORY_ACCENTS: Record<string, { color: string; bgGlow: string }> = {
  writing: { color: 'from-violet-600 to-purple-600', bgGlow: 'rgba(139, 92, 246, 0.15)' },
  coding: { color: 'from-amber-500 to-[#FF8A00]', bgGlow: 'rgba(255, 138, 0, 0.15)' },
  image: { color: 'from-pink-600 to-rose-600', bgGlow: 'rgba(244, 63, 94, 0.15)' },
  text: { color: 'from-emerald-600 to-teal-600', bgGlow: 'rgba(16, 185, 129, 0.15)' },
  seo: { color: 'from-amber-600 to-orange-600', bgGlow: 'rgba(245, 158, 11, 0.15)' },
  data: { color: 'from-amber-600 to-orange-500', bgGlow: 'rgba(255, 138, 0, 0.15)' },
};

export async function fetchLiveLandingData() {
  try {
    const [rawTools, rawCategories, rawPosts, totalTools, totalPosts, totalCategories] =
      await Promise.all([
        prisma.tool.findMany({
          where: { status: 'PUBLISHED' },
          include: { category: true },
          orderBy: [{ isFeatured: 'desc' }, { publishedAt: 'desc' }],
          take: 6,
        }),
        prisma.toolCategory.findMany({
          where: { isActive: true },
          include: {
            _count: { select: { tools: { where: { status: 'PUBLISHED' } } } },
          },
          orderBy: { displayOrder: 'asc' },
          take: 6,
        }),
        prisma.post.findMany({
          where: { status: 'PUBLISHED' },
          include: { contentCategory: true },
          orderBy: { publishedAt: 'desc' },
          take: 3,
        }),
        prisma.tool.count({ where: { status: 'PUBLISHED' } }),
        prisma.post.count({ where: { status: 'PUBLISHED' } }),
        prisma.toolCategory.count({ where: { isActive: true } }),
      ]);

    const tools: LiveTool[] = rawTools.map((t) => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      tagline: t.tagline,
      description: t.description,
      isFeatured: t.isFeatured,
      isFree: t.isFree,
      viewCount: t.viewCount,
      renderType: t.renderType,
      category: {
        id: t.category.id,
        name: t.category.name,
        slug: t.category.slug,
      },
    }));

    const categories: LiveCategory[] = rawCategories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      icon: c.icon,
      toolCount: c._count.tools,
    }));

    const posts: LivePost[] = rawPosts.map((p) => {
      const catName = p.contentCategory?.name || (typeof p.category === 'string' && p.category ? p.category : 'AI News');
      const catSlug = p.contentCategory?.slug || catName.toLowerCase().replace(/\s+/g, '-');
      return {
        id: p.id,
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt || '',
        readingTimeMins: p.readingTimeMins,
        publishedAt: p.publishedAt,
        contentType: p.contentType,
        category: {
          name: catName,
          slug: catSlug,
        },
      };
    });

    const stats: LivePlatformStats = {
      toolsCount: totalTools,
      articlesCount: totalPosts,
      categoriesCount: totalCategories,
    };

    return { tools, categories, posts, stats };
  } catch (error) {
    console.warn('[Live DB Data Fetcher] Database not yet reachable or empty:', (error as Error).message);
    return {
      tools: [],
      categories: [],
      posts: [],
      stats: { toolsCount: 0, articlesCount: 0, categoriesCount: 0 },
    };
  }
}
