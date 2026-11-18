import type { Metadata, Viewport } from "next"
import "@fontsource-variable/archivo/standard.css"
import "@fontsource-variable/jetbrains-mono"
import "./globals.css"

export const metadata: Metadata = {
  title: "Mako: the interpretation layer for Hyperliquid",
  description:
    "Order flow, positioning and crowd behaviour on Hyperliquid, read for you and put into plain English. Join the waitlist.",
  icons: { icon: "/mako-star.svg" },
}

export const viewport: Viewport = { themeColor: "#08080A" }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
