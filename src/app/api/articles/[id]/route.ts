import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import slugify from 'slugify';
import { connectToDatabase } from '@/lib/db/mongodb';
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
export async function GET(req: NextRequest, context: RouteContext) {
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
    const { searchParams } = new URL(req.url);
    const shouldIncrementView = searchParams.get('trackView') === 'true';

    let article;
    if (shouldIncrementView) {
      article = await Article.findOneAndUpdate(
        query,
        { $inc: { views: 1 } },
        { new: true }
      ).populate('coverImageId', 'filename contentType size url');
    } else {
      article = await Article.findOne(query).populate('coverImageId', 'filename contentType size url');
    }

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
 * PUT / PATCH /api/articles/[id]
 * Updates an existing article with optional slug re-generation and reading time updates.
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
    if (body.excerpt !== undefined) existing.excerpt = body.excerpt.trim();

    // Handle content and reading time recalculation
    if (body.content !== undefined) {
      existing.content = body.content;
      const plainText = body.content.replace(/<[^>]*>/g, '').trim();
      const wordCount = plainText ? plainText.split(/\s+/).length : 0;
      existing.readingTime = Math.max(1, Math.ceil(wordCount / 200));
    }

    if (body.coverImage !== undefined) existing.coverImage = body.coverImage.trim();
    if (body.coverImageId !== undefined) existing.coverImageId = body.coverImageId || null;
    if (body.category !== undefined) existing.category = body.category.trim();

    if (body.tags !== undefined) {
      existing.tags = Array.isArray(body.tags)
        ? body.tags.map((t: string) => String(t).trim()).filter(Boolean)
        : typeof body.tags === 'string'
        ? body.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
        : [];
    }

    if (body.author) {
      existing.author = {
        name: body.author.name?.trim() || existing.author.name,
        avatar: body.author.avatar?.trim() || existing.author.avatar,
        bio: body.author.bio?.trim() || existing.author.bio,
      };
    }

    if (body.status && ['draft', 'published', 'archived'].includes(body.status)) {
      if (body.status === 'published' && !existing.publishedAt) {
        existing.publishedAt = new Date();
      }
      existing.status = body.status;
    }

    if (body.metaTitle !== undefined) existing.metaTitle = body.metaTitle.trim();
    if (body.metaDescription !== undefined) existing.metaDescription = body.metaDescription.trim();

    await existing.save();

    return NextResponse.json(
      {
        success: true,
        article: {
          ...existing.toObject(),
          id: existing._id.toString(),
        },
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
