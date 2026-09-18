/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    // The Google Place ID is read as NEXT_PUBLIC_GOOGLE_PLACE_ID, but either
    // name works in Vercel: whichever is set gets inlined at build time, so
    // server and browser always see the same value (see lib/business.ts).
    NEXT_PUBLIC_GOOGLE_PLACE_ID:
      process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID || process.env.GOOGLE_PLACE_ID || "",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
