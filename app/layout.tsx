import type React from "react"
import type { Metadata } from "next"
import { Inter, Roboto_Mono } from "next/font/google"
import "./globals.css"
import Ads from "@/components/ads"

// Initialize the Inter font for sans-serif text
const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: "--font-inter",
})

// Initialize the Roboto Mono font for monospaced text
const roboto_mono = Roboto_Mono({
  subsets: ["latin"],
  display: 'swap',
  variable: "--font-roboto-mono",
})

export const metadata: Metadata = {
  title: "QR Analytics - Generate and Track QR Codes",
  description: "Create QR codes and track their performance with detailed analytics",
  generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${roboto_mono.variable} antialiased`}>
      <body>
        {children}
        <Ads />
      </body>
    </html>
  )
}
