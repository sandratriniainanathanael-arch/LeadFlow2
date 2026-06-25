import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://leadflow.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "LeadFlow — Find Verified Business Leads In Seconds",
    template: "%s | LeadFlow",
  },
  description:
    "Scrape businesses, emails, phone numbers and websites from any city with AI-powered lead generation. The fastest business leads software for B2B prospecting and local business leads.",
  keywords: [
    "business leads",
    "lead generation software",
    "email scraper",
    "b2b prospecting",
    "local business leads",
    "lead generation",
    "b2b sales tool",
    "cold email leads",
  ],
  authors: [{ name: "LeadFlow" }],
  creator: "LeadFlow",
  publisher: "LeadFlow",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "LeadFlow",
    title: "LeadFlow — Find Verified Business Leads In Seconds",
    description:
      "Scrape businesses, emails, phone numbers and websites from any city with AI-powered lead generation.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "LeadFlow — B2B Lead Generation Platform" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "LeadFlow — Find Verified Business Leads In Seconds",
    description:
      "Scrape businesses, emails, phone numbers and websites from any city with AI-powered lead generation.",
    images: ["/og-image.png"],
    creator: "@leadflow",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#00E5FF",
          colorBackground: "#0B1225",
          colorText: "#E7ECF7",
          colorInputBackground: "#0E1730",
          colorInputText: "#FFFFFF",
        },
      }}
    >
      <html lang="en" className="dark" suppressHydrationWarning>
        <body
          className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} bg-background font-sans text-white antialiased`}
        >
          <ThemeProvider>
            <TooltipProvider delayDuration={150}>
              {children}
              <Toaster />
            </TooltipProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
