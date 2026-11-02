import { NextResponse } from 'next/server';
import { executeTool } from '@/lib/tools/registry';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const startTime = performance.now();
  try {
    const body = await request.json();
    const { slug, input, options } = body;

    if (!slug) {
      return NextResponse.json(
        { success: false, error: { message: 'Tool slug is required.' } },
        { status: 400 }
      );
    }

    const result = await executeTool(slug, input || '', options || {});
    const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;

    return NextResponse.json({
      ...result,
      telemetry: {
        ...result.telemetry,
        executionTimeMs: result.telemetry?.executionTimeMs || executionTimeMs,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: { message: error?.message || 'Server execution failed.' },
        telemetry: {
          executionTimeMs: Math.round((performance.now() - startTime) * 100) / 100,
          inputChars: 0,
          outputChars: 0,
        },
      },
      { status: 500 }
    );
  }
}
