#!/usr/bin/env node
/* Post-build checks on the pages customers and crawlers actually get.
   Run after `next build`: `npm run check:site`.

   Deliberately narrow — it reads only the prerendered HTML, sitemap and
   robots output in .next/, never source files, so comments, git history,
   Instagram captions in lib/gallery.ts and config can't trip it. Each rule
   targets one specific regression. */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

const ORIGIN = "https://www.dallastint.shop";
const APP = ".next/server/app";
const WARRANTY_NOTE =
  "Coverage and exclusions vary by service and product. Contact the shop for warranty details.";

if (!existsSync(APP)) {
  console.error("No build found — run `npm run build` first.");
  process.exit(1);
}

function htmlFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    if (e.isDirectory()) return htmlFiles(p);
    return e.name.endsWith(".html") ? [p] : [];
  });
}

const pages = htmlFiles(APP)
  .filter((f) => !/_not-found|\/_/.test(f))
  .map((file) => {
    const route = "/" + relative(APP, file).replace(/\.html$/, "").replace(/^index$/, "");
    return { file, route, html: readFileSync(file, "utf8") };
  });

const failures = [];
const fail = (route, msg) => failures.push(`${route}: ${msg}`);

// Visible text + attributes, minus the RSC flight payload (a duplicate of
// the same content, which would double-report every hit).
const markup = (html) => html.replace(/<script>self\.__next_f[\s\S]*?<\/script>/g, "");

for (const { route, html } of pages) {
  const m = markup(html);
  const expected = route === "/" ? ORIGIN : ORIGIN + route;

  // 1. Brand claims the client asked to remove.
  const banned = m.match(/\bxpel\b|gtechniq|modesta/gi);
  if (banned) fail(route, `removed brand still present: ${[...new Set(banned)].join(", ")}`);

  // 2. Warranty: no competing durations; every asterisk has its footnote.
  const durations = m.match(/\b\d+[- ]?(?:year|yr)s?\b[^<]{0,20}warrant/gi);
  if (durations) fail(route, `fixed-term warranty claim: ${durations.join(" | ")}`);
  if (m.includes("Lifetime Warranty*") && !m.includes(WARRANTY_NOTE))
    fail(route, "Lifetime Warranty* shown without its footnote");

  // 3. Exactly one canonical, pointing at this page on www.
  const canon = [...m.matchAll(/<link rel="canonical" href="([^"]+)"/g)].map((x) => x[1]);
  if (canon.length !== 1) fail(route, `expected 1 canonical, found ${canon.length}`);
  else if (canon[0] !== expected) fail(route, `canonical ${canon[0]} ≠ ${expected}`);

  const ogImages = m.match(/<meta property="og:image" content="/g) ?? [];
  if (ogImages.length !== 1) fail(route, `expected 1 og:image, found ${ogImages.length}`);

  const og = m.match(/<meta property="og:url" content="([^"]+)"/)?.[1];
  if (og !== expected) fail(route, `og:url ${og} ≠ ${expected}`);

  // 4. Nothing points at the redirecting bare domain.
  if (/https:\/\/dallastint\.shop/.test(m)) fail(route, "references non-www https://dallastint.shop");

  // 5. Structured data parses, has no self-serving rating, one business id.
  for (const [, json] of m.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    let data;
    try {
      data = JSON.parse(json);
    } catch {
      fail(route, "JSON-LD does not parse");
      continue;
    }
    const s = JSON.stringify(data);
    if (/aggregateRating|"@type":"Review"/.test(s)) fail(route, "JSON-LD contains review/rating markup");
    for (const [, id] of s.matchAll(/"@id":"([^"]*#business)"/g))
      if (id !== `${ORIGIN}/#business`) fail(route, `inconsistent business @id ${id}`);
  }

  // 6. Internal links resolve to a built page.
  const routes = new Set(pages.map((p) => p.route));
  for (const [, href] of m.matchAll(/href="(\/[^"#?]*)(?:[#?][^"]*)?"/g)) {
    if (href.startsWith("/_next/") || href.startsWith("/brand/") || href.startsWith("/gallery/")) continue;
    if (/\.(png|jpe?g|ico|svg|webmanifest|xml|txt)$/.test(href) || href.startsWith("/icon") || href.startsWith("/opengraph-image")) continue;
    if (!routes.has(href)) fail(route, `internal link to missing page ${href}`);
  }

  // 7. One H1.
  const h1 = (m.match(/<h1[\s>]/g) ?? []).length;
  if (h1 !== 1) fail(route, `expected 1 <h1>, found ${h1}`);
}

// 8. Sitemap and robots.
const sitemap = readFileSync(join(APP, "sitemap.xml.body"), "utf8");
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((x) => x[1]);
for (const loc of locs) if (!loc.startsWith(ORIGIN)) failures.push(`sitemap: non-www URL ${loc}`);
for (const { route } of pages) {
  const url = route === "/" ? ORIGIN : ORIGIN + route;
  if (!locs.includes(url)) failures.push(`sitemap: missing ${url}`);
}
const robots = readFileSync(join(APP, "robots.txt.body"), "utf8");
if (!robots.includes(`Sitemap: ${ORIGIN}/sitemap.xml`)) failures.push("robots.txt: sitemap line not on www");

console.log(`Checked ${pages.length} pages: ${pages.map((p) => p.route).join(" ")}`);
if (failures.length) {
  console.error(`\n${failures.length} problem(s):\n- ${failures.join("\n- ")}`);
  process.exit(1);
}
console.log("All site checks passed.");
