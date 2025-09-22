import type React from "react";
import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import Ads from "@/components/ads";

// Initialize the Inter font for sans-serif text
const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: "--font-inter",
});

// Initialize the Roboto Mono font for monospaced text
const roboto_mono = Roboto_Mono({
  subsets: ["latin"],
  display: 'swap',
  variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
  title: "QR Analytics - Generate and Track QR Codes",
  description: "Create QR codes and track their performance with detailed analytics",
  generator: 'v0.app',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  keywords: [
    'QR code generator',
    'QR code analytics',
    'QR tracking',
    'scan analytics',
    'device type analytics',
    'country analytics',
    'browser analytics',
    'barcode generator'
  ],
  openGraph: {
    type: 'website',
    url: '/',
    title: 'QR Analytics - Generate and Track QR Codes',
    description: 'Generate QR codes and track scans, countries, device type, browser, OS and time.',
    siteName: 'QR Analytics',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Analytics - Generate and Track QR Codes',
    description: 'Generate QR codes and track scans, countries, device type, browser, OS and time.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${roboto_mono.variable} antialiased`}>
      <body>
        <main>
          {children}
          {/* In-flow site-wide banner below content */}
          <Ads />
        </main>
        {/* Organization JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'QR Analytics',
              url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
              logo: (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000') + '/placeholder-logo.png'
            })
          }}
        />
        {/* WebSite JSON-LD with search action */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'QR Analytics',
              url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
            })
          }}
        />
      </body>
    </html>
  );
}
