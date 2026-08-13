import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/* Search crawlers and AI assistants are both allowed everywhere.

   The AI agents are listed explicitly rather than left to the wildcard for
   one reason: when someone asks ChatGPT or Perplexity "who does ceramic
   tint near Richardson", the answer is assembled from pages those crawlers
   were allowed to read. For a shop whose whole job is being found locally,
   blocking them costs referrals and gains nothing — there is no paywalled
   content here.

   OAI-SearchBot and PerplexityBot serve live answers with citations;
   GPTBot and ClaudeBot are for model training; ChatGPT-User and
   Claude-User fetch a page when a user asks about it directly. */
const AI_AGENTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "meta-externalagent",
  "Bytespider",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...AI_AGENTS.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
