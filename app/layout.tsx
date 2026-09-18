import type { Metadata, Viewport } from "next";
import StructuredData from "@/components/StructuredData";
import { Bebas_Neue, Inter } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import { BUSINESS } from "@/lib/business";
import "./globals.css";

const display = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

/* Site-wide defaults only. Canonicals are set per page (lib/metadata.ts) —
   a canonical here would be inherited by any page that forgot its own and
   point it at the homepage. */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BUSINESS.name} | Window Tint, PPF & Wraps in Richardson, TX`,
    template: `%s | ${BUSINESS.name}`,
  },
  description:
    "Window tint, paint protection film, vinyl wraps, ceramic coating, powder coating and chrome delete in Richardson, TX, serving Dallas.",
  applicationName: BUSINESS.name,
  // Search Console HTML-tag verification. Set the token in Vercel when the
  // property is created; absent, no tag is rendered.
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#050505",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="bg-brand-black text-brand-off antialiased">
        <a
          href="#main"
          className="sr-only z-[60] rounded-sm bg-white px-4 py-3 text-sm font-medium text-black focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <StructuredData />
        {children}
      </body>
    </html>
  );
}
