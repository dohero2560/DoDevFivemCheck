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
    default: "FiveM Player Identifier Checker | Check Player IDs & Server Info",
    template: "%s | FiveM Player Identifier Checker"
  },
  description: "Free tool to check FiveM player identifiers, server information, and player details. Easily verify player IDs, server IP, port, and more for FiveM servers.",
  keywords: ["FiveM", "player identifier", "server checker", "FiveM server", "player ID", "server IP", "FiveM tools"],
  authors: [{ name: "FiveM Checker" }],
  creator: "FiveM Checker",
  publisher: "FiveM Checker",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://fivem-checker.vercel.app'),
  openGraph: {
    title: "FiveM Player Identifier Checker",
    description: "Check FiveM player identifiers and server information easily",
    url: 'https://fivem-checker.vercel.app',
    siteName: 'FiveM Player Identifier Checker',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FiveM Player Identifier Checker',
    description: 'Check FiveM player identifiers and server information easily',
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
    google: 'your-google-site-verification', // Add your Google verification code here
  },
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