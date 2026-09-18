import type { Metadata } from "next";
import { BUSINESS } from "./business";
import { absoluteUrl } from "./site";

// app/opengraph-image.tsx renders this; listed explicitly because a page
// that sets `openGraph` otherwise loses the inherited file-based image.
const SHARE_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Dallas Tint Shop — window tint, PPF, wraps and chrome delete in Richardson, TX",
};

/* Per-page metadata with its own canonical and og:url.

   Next merges metadata shallowly: a page that sets `openGraph` replaces the
   layout's whole openGraph object. So every page goes through this helper
   and gets the full set, rather than inheriting a canonical of "/" — which
   is what the root layout used to hand every page that forgot to set one. */
export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
}: {
  title: string;
  description: string;
  path: string;
  /** Use the title as-is instead of appending " | Dallas Tint Shop" */
  absoluteTitle?: boolean;
}): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${BUSINESS.name}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: absoluteUrl(path),
      siteName: BUSINESS.name,
      locale: "en_US",
      type: "website",
      images: [SHARE_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [SHARE_IMAGE.url],
    },
  };
}
