import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Dallas Tint Shop — Premium Tint, PPF & Wraps in Richardson, TX",
  description:
    "Dallas / Richardson's premium automotive studio for ceramic window tint, paint protection film, vinyl wraps, ceramic coatings, paint correction, and powder coating. Trusted by Dallas car enthusiasts.",
  keywords: [
    "Dallas tint shop",
    "Richardson window tint",
    "ceramic tint Dallas",
    "PPF Dallas",
    "paint protection film Richardson",
    "car wraps Dallas",
    "ceramic coating Dallas",
    "paint correction Dallas",
    "powder coating Dallas",
  ],
  metadataBase: new URL("https://dallastintshop.com"),
  openGraph: {
    title: "Dallas Tint Shop — Premium Tint, PPF & Wraps",
    description:
      "Performance-focused tint, PPF, wraps, ceramic coating, and detailing trusted by Dallas car enthusiasts.",
    url: "https://dallastintshop.com",
    siteName: "Dallas Tint Shop",
    locale: "en_US",
    type: "website",
  },
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
        {children}
      </body>
    </html>
  );
}
