import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const HEALTH_ENDPOINT = 'https://workwithadarsh15-cody-search-api.hf.space/health';

export async function GET() {
  const start = Date.now();
  try {
    const res = await fetch(HEALTH_ENDPOINT, {
      cache: 'no-store',
      signal: AbortSignal.timeout(10000),
    });

    const latencyMs = Date.now() - start;

    if (!res.ok) {
      return NextResponse.json(
        { status: 'degraded', code: res.status, latencyMs },
        { status: 200 }
      );
    }

    const data = await res.json().catch(() => ({}));
    const isHealthy = data.status === 'healthy' || data.status === 'ok';

    return NextResponse.json(
      {
        status: isHealthy ? 'healthy' : 'degraded',
        upstream: data,
        latencyMs,
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (err: any) {
    const latencyMs = Date.now() - start;
    return NextResponse.json(
      {
        status: 'offline',
        error: err?.message || 'Upstream API unreachable',
        latencyMs,
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  }
}
