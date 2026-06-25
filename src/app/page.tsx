import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/marketing/hero";
import { Features } from "@/components/marketing/features";
import { Pricing } from "@/components/marketing/pricing";
import { HowItWorks, CTA } from "@/components/marketing/how-it-works-cta";

export const metadata: Metadata = {
  title: "LeadFlow — Find Verified Business Leads In Seconds",
  description:
    "Scrape businesses, emails, phone numbers and websites from any city with AI-powered lead generation. The leading business leads software for B2B prospecting.",
  alternates: { canonical: "/" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "LeadFlow",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "AI-powered B2B lead generation platform that scrapes verified business leads, emails, and phone numbers from any city.",
  offers: [
    { "@type": "Offer", name: "Starter", price: "4.99", priceCurrency: "USD" },
    { "@type": "Offer", name: "Pro", price: "19.99", priceCurrency: "USD" },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
