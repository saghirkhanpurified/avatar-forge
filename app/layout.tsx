import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The Avatar Forge | Free AI Pixel Art Generator",
  description: "Forge unique 1-of-1 pixel art avatars instantly. The best free AI pixel art engine for Web3, gaming, and 16-bit RPG assets.",
  verification: {
    google: "Numt_xZgHuBPBALKfYw7inpQIHZk7DvRDR4fMW0qLko",
  },
  keywords: ["pixel art", "AI generator", "free nft art", "16-bit sprite", "avatar maker"],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "The Avatar Forge | AI Pixel Art",
    description: "Create your unique digital identity for free.",
    url: "https://theavatarforge.vercel.app",
    siteName: "The Avatar Forge",
    images: [{ url: "/vault-1.png", width: 800, height: 800 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Avatar Forge | AI Pixel Art",
    description: "Forge unique AI pixel art in seconds.",
    images: ["/vault-1.png"],
    creator: "@SaghirWeb3",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Elite Upgrade Font: Silkscreen */}
        <link href="https://fonts.googleapis.com/css2?family=Silkscreen:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={inter.className}>
        {/* JSON-LD Schema for Google Search Authority */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "The Avatar Forge",
              "operatingSystem": "Web",
              "applicationCategory": "DesignApplication",
              "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
              "description": "The best free AI pixel art generator.",
            }),
          }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}