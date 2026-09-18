/* GET /api/reviews — live Google reviews for the homepage carousel.

   The homepage itself stays static; the carousel asks this route for live
   reviews once it scrolls near view. That keeps a Google outage, a bad
   key or a missing config from ever touching the rest of the page: any
   failure here returns `unavailable` and the carousel keeps showing the
   verified selection it rendered with.

   Nothing is cached — see lib/reviews/places.ts for the Google Maps
   Platform terms that require that. */

import { placesConfigured, reviewsResponse } from "@/lib/reviews/places";
import type { ReviewsResponse } from "@/lib/reviews/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const NO_STORE = { "Cache-Control": "no-store" };

/* Every call here can cost a billable Google request, and the route is
   public, so bound how fast one client can spend. Same caveat as the quote
   route: module-scope state is per serverless instance and resets on cold
   starts, so this limits a single client on a warm instance — it is not a
   global limit. Google Cloud's per-key quota is the real ceiling; set one. */
const WINDOW_MS = 60 * 1000;
const MAX_PER_WINDOW = 10;
const hits = new Map<string, number[]>();

function limited(req: Request): boolean {
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  const now = Date.now();
  if (hits.size > 5000) hits.clear();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) return true;
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

function reply(body: ReviewsResponse, status: number): Response {
  return Response.json(body, { status, headers: NO_STORE });
}

export async function GET(req: Request): Promise<Response> {
  // Checked before the rate limit so an unconfigured site never counts hits.
  if (!placesConfigured()) {
    return reply({ status: "unavailable", reason: "not-configured" }, 503);
  }
  if (limited(req)) {
    return reply({ status: "unavailable", reason: "rate-limited" }, 429);
  }
  const { status, body } = await reviewsResponse();
  return reply(body, status);
}
