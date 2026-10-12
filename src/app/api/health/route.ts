import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();
  let dbStatus = 'disconnected';
  let dbLatencyMs: number | null = null;

  try {
    const dbPingStart = Date.now();
    // Database connectivity probe across connection pool
    await prisma.toolCategory.count();
    dbLatencyMs = Date.now() - dbPingStart;
    dbStatus = 'connected';
  } catch (error) {
    dbStatus = `unreachable: ${(error as Error).message}`;
  }

  const isHealthy = dbStatus === 'connected';
  const responseData = {
    status: isHealthy ? 'healthy' : 'degraded',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV ?? 'production',
    commit:
      process.env.VERCEL_GIT_COMMIT_SHA ??
      process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ??
      process.env.GIT_COMMIT_SHA ??
      'production-v1',
    database: {
      status: dbStatus,
      latencyMs: dbLatencyMs,
    },
    latencyMs: Date.now() - startTime,
  };

  return NextResponse.json(responseData, {
    status: isHealthy ? 200 : 503,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}
