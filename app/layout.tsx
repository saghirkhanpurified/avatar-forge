import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The Avatar Forge | Free AI Pixel Art Generator",
  description: "Create unique 1-of-1 pixel art avatars in seconds. The best free AI pixel art generator for Web3, indie games, and digital identities. No wallets required.",
  verification: {
    google: "Numt_xZgHuBPBALKfYw7inpQIHZk7DvRDR4fMW0qLko",
  },
  keywords: [
    "pixel art generator", 
    "AI pixel art", 
    "free NFT maker", 
    "Web3 avatar", 
    "16-bit art generator", 
    "profile picture maker",
    "RPG character generator"
  ],
  openGraph: {
    title: "The Avatar Forge | AI Pixel Art Generator",
    description: "Generate custom 1-of-1 pixel art avatars completely for free. Build your digital identity.",
    url: "https://theavatarforge.vercel.app",
    siteName: "The Avatar Forge",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Avatar Forge | AI Pixel Art Generator",
    description: "Generate custom 1-of-1 pixel art avatars completely for free.",
    creator: "@SaghirWeb3",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* JSON-LD Structured Data for Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "The Avatar Forge",
              "operatingSystem": "Web",
              "applicationCategory": "DesignApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "description": "The best free AI pixel art generator for 16-bit avatars and NFT art.",
              "featureList": "AI Image Generation, Pixel Art Style, 1-of-1 Avatars, Commercial Usage Rights"
            }),
          }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}