import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { FAQ_ITEMS } from "@/lib/data/faq";

export const metadata: Metadata = {
  title: "FAQ — Business Leads, Pricing & Data Quality | LeadFlow",
  description:
    "Answers to the most common questions about LeadFlow: verified emails, lead pricing, data freshness, refunds, supported countries, and the legality of business lead scraping.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  const categories = Array.from(new Set(FAQ_ITEMS.map((item) => item.category)));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main>
        <section className="border-b border-border/60 py-20">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Frequently asked questions
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              Everything you need to know about data quality, pricing, and how LeadFlow works.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-3xl px-6">
            {categories.map((category) => (
              <div key={category} className="mb-12">
                <h2 className="mb-2 font-display text-sm font-semibold uppercase tracking-wider text-cyan">
                  {category}
                </h2>
                <Accordion type="multiple" className="rounded-2xl border border-border bg-card px-6">
                  {FAQ_ITEMS.filter((item) => item.category === category).map((item) => (
                    <AccordionItem key={item.question} value={item.question}>
                      <AccordionTrigger>{item.question}</AccordionTrigger>
                      <AccordionContent>{item.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}

            <div className="mt-16 rounded-2xl border border-cyan/30 bg-card p-8 text-center">
              <h3 className="font-display text-xl font-semibold text-white">
                Still have questions?
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Our team is happy to help with anything not covered above.
              </p>
              <a
                href="/contact"
                className="mt-5 inline-flex h-11 items-center justify-center rounded-xl bg-gradient-brand px-6 text-sm font-medium text-white shadow-glow"
              >
                Contact support
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
