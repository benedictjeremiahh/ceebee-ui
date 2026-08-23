import { timingSafeEqual } from 'node:crypto';
import { buildHealthReport } from '@/lib/health';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// The documentation is public; what it reports about its own build is not. Closed by default, with
// a bearer token unique to this Deployment.
export async function GET(req: Request) {
  const token = process.env.HEALTH_TOKEN;
  if (!token) {
    return new Response('health endpoint is not configured', { status: 503 });
  }
  const offered = req.headers.get('authorization')?.replace(/^Bearer /, '') ?? '';
  if (!matches(offered, token)) {
    return new Response('unauthorized', { status: 401 });
  }

  return Response.json(buildHealthReport(), { headers: { 'cache-control': 'no-store' } });
}

function matches(offered: string, expected: string) {
  const a = Buffer.from(offered);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
