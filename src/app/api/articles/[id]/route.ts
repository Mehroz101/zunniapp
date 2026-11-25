import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import slugify from 'slugify';
import { connectToDatabase } from '@/lib/db/mongodb';
import { getArticlePublicPath } from '@/lib/cms';
import { syncAndSubmitSeo } from '@/lib/seo/submit';
import { Article } from '@/models/Article';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * Helper to build lookup query (supports either MongoDB ObjectId or URL slug)
 */
function buildIdentifierQuery(idOrSlug: string) {
  if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
    return { _id: idOrSlug };
  }
  return { slug: idOrSlug.toLowerCase() };
}

/**
 * GET /api/articles/[id]
 * Retrieves a single article by its MongoDB ObjectId or unique slug.
 */
export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Article identifier is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const query = buildIdentifierQuery(id);
    const article = await Article.findOne(query);

    if (!article) {
      return NextResponse.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        article: {
          ...article.toObject(),
          id: article._id.toString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ [API GET /api/articles/[id]] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch article' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/articles/[id]
 * Updates an existing article matching the IArticle specification.
 */
export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Article identifier is required' },
        { status: 400 }
      );
    }

    const body = await req.json();
    await connectToDatabase();

    const query = buildIdentifierQuery(id);
    const existing = await Article.findOne(query);

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      );
    }

    // Handle Title / Slug changes
    if (body.title && body.title !== existing.title && !body.slug) {
      const newSlugBase = slugify(body.title, { lower: true, strict: true });
      let newSlug = newSlugBase;
      let counter = 1;
      while (await Article.exists({ slug: newSlug, _id: { $ne: existing._id } })) {
        newSlug = `${newSlugBase}-${counter}`;
        counter++;
      }
      existing.slug = newSlug;
      existing.title = body.title.trim();
    } else if (body.slug && body.slug !== existing.slug) {
      const formattedSlug = slugify(body.slug, { lower: true, strict: true });
      const slugExists = await Article.exists({ slug: formattedSlug, _id: { $ne: existing._id } });
      if (slugExists) {
        return NextResponse.json(
          { success: false, error: 'Requested slug is already taken by another article' },
          { status: 409 }
        );
      }
      existing.slug = formattedSlug;
    }

    if (body.title) existing.title = body.title.trim();

    // Handle content and reading time
    if (body.content !== undefined) {
      existing.content = body.content;
      if (body.readingTime === undefined) {
        const plainText = body.content.replace(/<[^>]*>/g, '').trim();
        const wordCount = plainText ? plainText.split(/\s+/).length : 0;
        existing.readingTime = Math.max(1, Math.ceil(wordCount / 200));
      }
    }

    if (body.readingTime !== undefined) existing.readingTime = Number(body.readingTime);
    if (body.type && ['guide', 'news'].includes(body.type)) existing.type = body.type;
    if (body.category !== undefined) existing.category = body.category.trim();

    const image = body.featuredImage !== undefined ? body.featuredImage : body.coverImage;
    if (image !== undefined) existing.featuredImage = image.trim();

    if (body.seo) {
      existing.seo = {
        title: body.seo.title !== undefined ? body.seo.title.trim() : existing.seo?.title || '',
        description: body.seo.description !== undefined ? body.seo.description.trim() : existing.seo?.description || '',
      };
    }

    if (body.status && ['draft', 'published'].includes(body.status)) {
      existing.status = body.status;
    }

    await existing.save();

    let seoSync = null;
    if (existing.status === 'published') {
      const publicPath = getArticlePublicPath(existing.slug, existing.type);
      seoSync = await syncAndSubmitSeo({
        urls: [publicPath],
        pathsToRevalidate: [publicPath],
      }).catch(() => null);
    }

    return NextResponse.json(
      {
        success: true,
        article: {
          ...existing.toObject(),
          id: existing._id.toString(),
        },
        seoSync,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ [API PUT /api/articles/[id]] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update article' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/articles/[id]
 * Permanently deletes an article document by ID or slug.
 */
export async function DELETE(_req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Article identifier is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const query = buildIdentifierQuery(id);
    const deleted = await Article.findOneAndDelete(query);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Article not found or already deleted' },
        { status: 404 }
      );
    }

    const publicPath = getArticlePublicPath(deleted.slug, deleted.type);
    await syncAndSubmitSeo({
      pathsToRevalidate: [publicPath],
      includeFullSitemap: false,
      urls: [],
    }).catch(() => null);

    return NextResponse.json(
      {
        success: true,
        message: 'Article deleted successfully',
        id: deleted._id.toString(),
        slug: deleted.slug,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ [API DELETE /api/articles/[id]] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete article' },
      { status: 500 }
    );
  }
}
