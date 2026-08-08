import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.dayofus.org"),
  title: "Day of Us — Free Wedding Website & Guest Hub",
  description: "Create a free wedding page in minutes. Guests RSVP, request songs, upload photos and leave wishes — all from one link you share. No app required.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Day of Us — Free Wedding Website & Guest Hub",
    description: "Create a free wedding page in minutes. Guests RSVP, request songs, upload photos and leave wishes — all from one link you share. No app required.",
    url: "https://www.dayofus.org",
    siteName: "Day of Us",
    images: [
      {
        url: "https://www.dayofus.org/og-image.png",
        width: 1200,
        height: 630,
        alt: "Day of Us — One Wedding Page, Everything Included",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Day of Us — Free Wedding Website & Guest Hub",
    description: "Create a free wedding page in minutes. Guests RSVP, request songs, upload photos and leave wishes — all from one link you share. No app required.",
    images: ["https://www.dayofus.org/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Day of Us",
              url: "https://www.dayofus.org",
              logo: "https://www.dayofus.org/icon-512.png",
              description: "A free wedding website builder with RSVPs, song requests, QR code photo uploads, and guest wishes.",
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Day of Us",
              url: "https://www.dayofus.org",
            }),
          }}
        />
      </head>
      <body className="bg-cream text-navy antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
