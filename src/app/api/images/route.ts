import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Media } from '@/models/Media';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'image/avif',
]);

const MAX_FILE_SIZE = 12 * 1024 * 1024; // 12MB (Safe within MongoDB 16MB document limit)

/**
 * POST /api/images
 * Ingests graphical files from multipart/form-data, converts them to binary buffers,
 * and saves them directly to MongoDB without external third-party dependencies.
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const altText = (formData.get('altText') as string) || '';
    const caption = (formData.get('caption') as string) || '';

    if (!file || typeof file === 'string') {
      return NextResponse.json(
        { success: false, error: 'No image file uploaded in "file" field' },
        { status: 400 }
      );
    }

    // MIME type validation
    const contentType = file.type.toLowerCase();
    if (!ALLOWED_MIME_TYPES.has(contentType)) {
      return NextResponse.json(
        {
          success: false,
          error: `Unsupported media format: ${file.type}. Allowed formats: JPEG, PNG, WebP, GIF, SVG, AVIF`,
        },
        { status: 400 }
      );
    }

    // Size validation
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: `File size (${(file.size / (1024 * 1024)).toFixed(2)}MB) exceeds maximum limit of 12MB`,
        },
        { status: 413 }
      );
    }

    // Convert file to binary buffer
    const arrayBuffer = await file.arrayBuffer();
    const dataBuffer = Buffer.from(arrayBuffer);

    await connectToDatabase();

    const media = await Media.create({
      filename: file.name || `image_${Date.now()}`,
      contentType,
      size: file.size,
      data: dataBuffer,
    });

    const publicUrl = `/api/images/${media._id.toString()}`;

    return NextResponse.json(
      {
        success: true,
        imageId: media._id.toString(),
        url: publicUrl,
        filename: media.filename,
        contentType: media.contentType,
        size: media.size,
        createdAt: media.createdAt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ [API /api/images] Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process and store media buffer' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/images
 * Lists uploaded media metadata (excluding heavy binary data buffer).
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const skip = (page - 1) * limit;

    await connectToDatabase();

    const [total, images] = await Promise.all([
      Media.countDocuments(),
      Media.find()
        .select('-data')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    const formattedImages = images.map((img) => ({
      ...img,
      id: img._id.toString(),
      url: `/api/images/${img._id.toString()}`,
    }));

    return NextResponse.json(
      {
        success: true,
        images: formattedImages,
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
    console.error('❌ [API GET /api/images] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve media library' },
      { status: 500 }
    );
  }
}
