import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { site } from "@/lib/site";
import { DEFAULT_OG_TITLE } from "@/lib/metadata";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LocalBusinessJsonLd } from "@/components/seo/LocalBusinessJsonLd";
import { CookieNotice } from "@/components/CookieNotice";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  axes: ["opsz"],
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Renovations & Custom Builds in Toronto & the ${site.serviceRegion}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  // Defaults for any page that doesn't set its own (share image comes from app/opengraph-image.tsx)
  openGraph: {
    type: "website",
    locale: "en_CA",
    siteName: site.name,
    title: DEFAULT_OG_TITLE,
    description: site.description,
  },
  twitter: { card: "summary_large_image", title: DEFAULT_OG_TITLE, description: site.description },
};

export const viewport: Viewport = {
  themeColor: "#14161B",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-CA" className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        {/* Enables scroll-reveal styles only when JS is running */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="flex min-h-screen flex-col">
        <Header />
        <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <Footer />
        <CookieNotice />
        <LocalBusinessJsonLd />
      </body>
    </html>
  );
}
