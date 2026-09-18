import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { SERVICES, servicePath } from "@/lib/services";

/* A fixed date rather than `new Date()`: stamping every URL with the build
   time tells crawlers everything changed on every deploy, which teaches
   them to ignore the field. Bump it when page content actually changes. */
const CONTENT_UPDATED = new Date("2026-09-17");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/"), lastModified: CONTENT_UPDATED, changeFrequency: "weekly", priority: 1 },
    ...SERVICES.map((s) => ({
      url: absoluteUrl(servicePath(s.slug)),
      lastModified: CONTENT_UPDATED,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    { url: absoluteUrl("/quote"), lastModified: CONTENT_UPDATED, changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/privacy"), lastModified: CONTENT_UPDATED, changeFrequency: "yearly", priority: 0.1 },
    { url: absoluteUrl("/terms"), lastModified: CONTENT_UPDATED, changeFrequency: "yearly", priority: 0.1 },
  ];
}
