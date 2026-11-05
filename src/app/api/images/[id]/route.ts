import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Media } from '@/models/Media';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/images/[id]
 * Streams raw binary image buffer directly from MongoDB without external storage services.
 */
export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid Image ID format' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const media = await Media.findById(id).select('data contentType size filename');

    if (!media || !media.data) {
      return NextResponse.json(
        { success: false, error: 'Image not found' },
        { status: 404 }
      );
    }

    // Convert Mongoose Binary / Buffer to Uint8Array for Web Response streaming
    const rawBuffer = Buffer.isBuffer(media.data)
      ? media.data
      : Buffer.from((media.data as unknown as { buffer: ArrayBuffer }).buffer);

    const uint8Array = new Uint8Array(rawBuffer);

    return new Response(uint8Array, {
      status: 200,
      headers: {
        'Content-Type': media.contentType || 'image/jpeg',
        'Content-Length': media.size ? media.size.toString() : rawBuffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Disposition': `inline; filename="${encodeURIComponent(media.filename || 'image')}"`,
      },
    });
  } catch (error) {
    console.error('❌ [API /api/images/[id]] Error serving image:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error streaming media' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/images/[id]
 * Permanently removes binary media document from MongoDB.
 */
export async function DELETE(_req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid Image ID format' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const deletedMedia = await Media.findByIdAndDelete(id);

    if (!deletedMedia) {
      return NextResponse.json(
        { success: false, error: 'Image not found or already deleted' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Image deleted successfully', id },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ [API DELETE /api/images/[id]] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error deleting media' },
      { status: 500 }
    );
  }
}
