import { NextRequest, NextResponse } from 'next/server';
import slugify from 'slugify';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Article, IArticle } from '@/models/Article';

/**
 * Helper to generate a collision-free unique slug.
 */
async function generateUniqueSlug(baseTitle: string, customSlug?: string): Promise<string> {
  const initialSlug = slugify(customSlug || baseTitle, {
    lower: true,
    strict: true,
    trim: true,
  });

  let slug = initialSlug;
  let counter = 1;

  while (await Article.exists({ slug })) {
    slug = `${initialSlug}-${counter}`;
    counter++;
  }

  return slug;
}

/**
 * GET /api/articles
 * Lists articles with pagination, category filter, tag filter, and text search.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));
    const category = searchParams.get('category')?.trim();
    const status = searchParams.get('status')?.trim();
    const tag = searchParams.get('tag')?.trim();
    const q = searchParams.get('q')?.trim();
    const sortField = searchParams.get('sort') || '-createdAt';

    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};

    if (status && status !== 'all' && ['draft', 'published', 'archived'].includes(status)) {
      filter.status = status;
    }

    if (category && category !== 'all') {
      filter.category = new RegExp(`^${category}$`, 'i');
    }

    if (tag) {
      filter.tags = tag;
    }

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { excerpt: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } },
      ];
    }

    await connectToDatabase();

    const [total, articles] = await Promise.all([
      Article.countDocuments(filter as any),
      Article.find(filter as any)
        .sort(sortField)
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    const formattedArticles = articles.map((doc) => {
      const a = doc as unknown as Record<string, unknown> & { _id: unknown };
      return {
        ...a,
        id: a._id ? String(a._id) : undefined,
      };
    });

    return NextResponse.json(
      {
        success: true,
        articles: formattedArticles,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ [API GET /api/articles] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve articles' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/articles
 * Creates a new article with automatic slug generation, collision avoidance, and reading time estimation.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      slug: customSlug,
      content,
      excerpt,
      coverImage,
      coverImageId,
      category = 'General',
      tags = [],
      author = {},
      status = 'draft',
      metaTitle,
      metaDescription,
    } = body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return NextResponse.json(
        { success: false, error: 'Article title is required' },
        { status: 400 }
      );
    }

    if (!content || typeof content !== 'string' || !content.trim()) {
      return NextResponse.json(
        { success: false, error: 'Article content is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Generate unique slug
    const uniqueSlug = await generateUniqueSlug(title, customSlug);

    // Calculate reading time
    const plainText = content.replace(/<[^>]*>/g, '').trim();
    const wordCount = plainText ? plainText.split(/\s+/).length : 0;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    // Normalize tags array
    const normalizedTags: string[] = Array.isArray(tags)
      ? tags.map((t: string) => String(t).trim()).filter(Boolean)
      : typeof tags === 'string'
      ? tags.split(',').map((t: string) => t.trim()).filter(Boolean)
      : [];

    const article = (await Article.create({
      title: title.trim(),
      slug: uniqueSlug,
      content,
      excerpt: excerpt?.trim() || plainText.slice(0, 160) + '...',
      coverImage: coverImage?.trim() || '',
      coverImageId: coverImageId || undefined,
      category: category.trim(),
      tags: normalizedTags,
      author: {
        name: author.name?.trim() || 'TOOLty Editorial Team',
        avatar: author.avatar?.trim() || '',
        bio: author.bio?.trim() || '',
      },
      status: ['draft', 'published', 'archived'].includes(status) ? status : 'draft',
      publishedAt: status === 'published' ? new Date() : undefined,
      readingTime,
      metaTitle: metaTitle?.trim() || title.trim(),
      metaDescription: metaDescription?.trim() || excerpt?.trim() || '',
    })) as unknown as IArticle;

    return NextResponse.json(
      {
        success: true,
        article: {
          ...article.toObject(),
          id: article._id.toString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ [API POST /api/articles] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create article' },
      { status: 500 }
    );
  }
}
