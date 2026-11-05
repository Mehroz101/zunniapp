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
 * Lists articles with pagination, type, category, status filters, and search.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));
    const type = searchParams.get('type')?.trim().toLowerCase();
    const category = searchParams.get('category')?.trim();
    const status = searchParams.get('status')?.trim().toLowerCase();
    const q = searchParams.get('q')?.trim();
    const sortField = searchParams.get('sort') || '-createdAt';

    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};

    if (type && ['guide', 'news'].includes(type)) {
      filter.type = type;
    }

    if (status && status !== 'all' && ['draft', 'published'].includes(status)) {
      filter.status = status;
    }

    if (category && category !== 'all') {
      filter.category = new RegExp(`^${category}$`, 'i');
    }

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
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
 * Creates a new article matching the IArticle specification.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      slug: customSlug,
      content,
      type = 'guide',
      category,
      featuredImage,
      coverImage, // alias for backwards compatibility
      seo,
      readingTime,
      status = 'draft',
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

    if (!category || typeof category !== 'string' || !category.trim()) {
      return NextResponse.json(
        { success: false, error: 'Article category is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Generate unique slug
    const uniqueSlug = await generateUniqueSlug(title, customSlug);

    // Calculate reading time if not provided
    let calculatedReadingTime = readingTime;
    if (!calculatedReadingTime || typeof calculatedReadingTime !== 'number') {
      const plainText = content.replace(/<[^>]*>/g, '').trim();
      const wordCount = plainText ? plainText.split(/\s+/).length : 0;
      calculatedReadingTime = Math.max(1, Math.ceil(wordCount / 200));
    }

    const image = featuredImage?.trim() || coverImage?.trim() || '';

    const article = (await Article.create({
      title: title.trim(),
      slug: uniqueSlug,
      content,
      type: ['guide', 'news'].includes(type) ? type : 'guide',
      category: category.trim(),
      featuredImage: image,
      seo: {
        title: seo?.title?.trim() || title.trim(),
        description: seo?.description?.trim() || '',
      },
      readingTime: calculatedReadingTime,
      status: ['draft', 'published'].includes(status) ? status : 'draft',
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
