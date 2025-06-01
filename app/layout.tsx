import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import VisitorCounter from "@/components/VisitorCounter"
import Analytics from "@/components/Analytics"
import GoogleAnalytics from "@/components/GoogleAnalytics"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "FIVEMCHECK - FiveM Player Identifier & Server Checker | #1 FiveM Tools",
    template: "%s | FIVEMCHECK - FiveM Tools"
  },
  description: "FIVEMCHECK - The #1 FiveM Player Identifier & Server Checker. Check FiveM player IDs, server information, and player details instantly. Free FiveM tools for server owners and players.",
  keywords: [
    "FIVEMCHECK",
    "FiveM checker",
    "FiveM player identifier",
    "FiveM server checker",
    "FiveM tools",
    "FiveM player ID",
    "FiveM server info",
    "FiveM player lookup",
    "FiveM server status",
    "FiveM player details"
  ],
  authors: [{ name: "FIVEMCHECK" }],
  creator: "FIVEMCHECK",
  publisher: "FIVEMCHECK",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://fivem-checker.vercel.app'),
  alternates: {
    canonical: 'https://fivem-checker.vercel.app',
  },
  openGraph: {
    title: "FIVEMCHECK - FiveM Player Identifier & Server Checker",
    description: "The #1 FiveM Player Identifier & Server Checker. Check player IDs, server information, and player details instantly.",
    url: 'https://fivem-checker.vercel.app',
    siteName: 'FIVEMCHECK',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://fivem-checker.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'FIVEMCHECK - FiveM Tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FIVEMCHECK - FiveM Player Identifier & Server Checker',
    description: 'The #1 FiveM Player Identifier & Server Checker. Check player IDs, server information, and player details instantly.',
    images: ['https://fivem-checker.vercel.app/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification',
  },
  category: 'FiveM Tools',
  classification: 'FiveM Player Identifier & Server Checker',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <GoogleAnalytics />
        <link rel="canonical" href="https://fivem-checker.vercel.app" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta name="revisit-after" content="1 days" />
        <meta name="rating" content="general" />
        <meta name="distribution" content="global" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Analytics />
          {children}
          <VisitorCounter />
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'      