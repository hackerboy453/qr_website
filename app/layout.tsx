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
  generator: 'v0.app'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // --- FIX STARTS HERE ---

  // Define the height of your ad banner + some extra space for a nice margin.
  // Adjust this value if your ad banner has a different height.
  const AD_BANNER_HEIGHT_PX = 90;
  const BOTTOM_MARGIN_PX = 20;
  const totalPadding = AD_BANNER_HEIGHT_PX + BOTTOM_MARGIN_PX;

  return (
    <html lang="en" className={`${inter.variable} ${roboto_mono.variable} antialiased`}>
      <body>
        {/* The <main> tag wraps your page content. We apply the bottom padding here
            to ensure content doesn't get hidden behind the fixed ad banner. */}
        <main style={{ paddingBottom: `${totalPadding}px` }}>
          {children}
        </main>

        {/* The Ads component is placed outside of <main> so it can be fixed
            to the bottom of the viewport without being affected by the main content's scroll. */}
        <Ads />
      </body>
    </html>
  );
  // --- FIX ENDS HERE ---
}

