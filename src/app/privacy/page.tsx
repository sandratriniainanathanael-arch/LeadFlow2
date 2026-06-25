import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Privacy Policy — LeadFlow",
  description: "How LeadFlow collects, uses, and protects data.",
  alternates: { canonical: "/privacy" },
};

const SECTIONS = [
  {
    title: "1. Information we collect",
    body: "We collect account information (name, email) via Clerk authentication, and usage data such as search history and exports. We do not collect payment card details directly — these are handled by Lemon Squeezy.",
  },
  {
    title: "2. Business data we surface",
    body: "LeadFlow displays publicly available business information sourced from providers like Google Places, Hunter.io, Abstract API, and Apify. This is business contact data, not personal consumer data.",
  },
  {
    title: "3. How we use your data",
    body: "We use your account data to operate the platform, enforce usage limits, process payments, and send service-related notifications.",
  },
  {
    title: "4. Data sharing",
    body: "We share data with infrastructure providers strictly necessary to run LeadFlow: Clerk (auth), Neon (database), Lemon Squeezy (payments), and Vercel (hosting). We do not sell your personal data to third parties.",
  },
  {
    title: "5. Your rights",
    body: "You may request access to, correction of, or deletion of your account data at any time by contacting support@leadflow.app.",
  },
  {
    title: "6. Data retention",
    body: "Account and search data is retained as long as your account is active, and for a reasonable period after closure for legal and accounting purposes.",
  },
  {
    title: "7. Security",
    body: "We use industry-standard encryption in transit (HTTPS) and rely on Clerk and Neon's security infrastructure to protect stored data.",
  },
  {
    title: "8. Changes to this policy",
    body: "We may update this policy periodically. Material changes will be communicated via email or in-app notification.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="py-20">
          <div className="mx-auto max-w-2xl px-6">
            <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">Privacy Policy</h1>
            <p className="mt-3 text-sm text-muted-foreground">Last updated: January 1, 2026</p>

            <div className="mt-10 space-y-8">
              {SECTIONS.map((s) => (
                <div key={s.title}>
                  <h2 className="font-display text-lg font-semibold text-white">{s.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
