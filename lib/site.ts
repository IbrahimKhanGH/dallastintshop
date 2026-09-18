/** Canonical origin, no trailing slash. Change here on a domain move.
 *
 *  www is the host Vercel actually serves — the bare domain 308s to it —
 *  so every canonical, sitemap entry and schema URL points here directly
 *  rather than at an address that immediately redirects. */
export const SITE_URL = "https://www.dallastint.shop";

/** Absolute URL for a site path ("/quote" → "https://www.…/quote"). */
export function absoluteUrl(path = "/"): string {
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}

/** schema.org @id of the business node, referenced from every page's JSON-LD. */
export const BUSINESS_SCHEMA_ID = `${SITE_URL}/#business`;
