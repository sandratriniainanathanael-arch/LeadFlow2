import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ShieldCheck, Target, Eye, Database, BadgeCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "About LeadFlow — Our Mission, Vision & Data Quality Standards",
  description:
    "Learn why LeadFlow exists, how we verify every email and phone number, and the quality standards behind our B2B lead generation platform.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="bg-grid">
        <section className="border-b border-border/60 py-20">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Built for sales teams who are tired of guessing
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              LeadFlow exists to remove the most tedious part of B2B sales: finding accurate
              contact information for the businesses you actually want to talk to.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-3xl px-6 space-y-16">
            {/* Mission */}
            <article>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand/10 ring-1 ring-inset ring-primary/20">
                  <Target className="h-5 w-5 text-cyan" />
                </div>
                <h2 className="font-display text-2xl font-bold text-white">Our mission</h2>
              </div>
              <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
                <p>
                  Our mission is simple to state and hard to execute well: give any business,
                  anywhere in the world, the ability to find verified leads for any type of
                  company in any city, in under a minute. We believe that prospecting should be
                  the easiest part of running a sales process, not the part that eats up half of
                  a representative's week.
                </p>
                <p>
                  Most lead generation tools fall into one of two camps. Either they sell you
                  access to a stale, pre-scraped database that hasn't been refreshed in months,
                  or they require you to learn a complicated scraping tool that breaks the moment
                  a website changes its layout. LeadFlow was built to sit between those two
                  extremes: real-time discovery, without the technical overhead.
                </p>
                <p>
                  Every search you run on LeadFlow queries live business data and runs it through
                  our enrichment pipeline on the spot. You are not browsing a cached list from
                  last quarter. You are looking at businesses as they exist right now, with
                  contact details that have been checked, not assumed.
                </p>
              </div>
            </article>

            {/* Vision */}
            <article>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand/10 ring-1 ring-inset ring-primary/20">
                  <Eye className="h-5 w-5 text-cyan" />
                </div>
                <h2 className="font-display text-2xl font-bold text-white">Our vision</h2>
              </div>
              <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
                <p>
                  We want LeadFlow to become the default starting point for anyone who needs to
                  build a list of businesses to contact — whether that's a two-person agency
                  pitching local restaurants, a SaaS founder validating a niche before building a
                  feature, or an enterprise sales team running territory-based outbound at scale.
                </p>
                <p>
                  Long term, we see lead generation moving away from static spreadsheets bought
                  once and used until they rot, and toward continuous, on-demand discovery: you
                  describe who you're looking for, and the platform finds them, verifies them,
                  and keeps the data current. That's the direction every part of LeadFlow's
                  architecture is being built toward, from our search pipeline to our pricing
                  model, which rewards usage instead of locking you into a database subscription
                  for data you'll only use once.
                </p>
                <p>
                  We also believe pricing should match how people actually use lead generation
                  tools. Some of you need 500 leads for one campaign and then nothing for two
                  months — that's why the Starter plan is a one-time purchase. Others run
                  outbound every single day — that's why Pro exists as an unlimited subscription.
                  Neither group should have to pay for the other's usage pattern.
                </p>
              </div>
            </article>

            {/* Why LeadFlow exists */}
            <article>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand/10 ring-1 ring-inset ring-primary/20">
                  <ShieldCheck className="h-5 w-5 text-cyan" />
                </div>
                <h2 className="font-display text-2xl font-bold text-white">Why LeadFlow exists</h2>
              </div>
              <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
                <p>
                  LeadFlow was started after watching the same problem repeat itself across
                  dozens of small sales teams: someone spends an entire afternoon manually
                  searching Google Maps, copying business names into a spreadsheet, opening each
                  website to find a contact email, and guessing at phone number formats. By the
                  time the list is "done," half the emails bounce and a third of the businesses
                  have already closed or rebranded.
                </p>
                <p>
                  That process doesn't scale, and it doesn't respect anyone's time. So we built
                  the tool we wished existed: type in a business type, a city, and a country, and
                  get back a structured table of companies with their phone number, email,
                  website, LinkedIn page, Google rating, and address — already collected, already
                  organized, ready to export.
                </p>
                <p>
                  We kept the free tier generous on purpose. You can run searches and see full
                  result tables — company names, ratings, addresses — without paying anything.
                  We only ask for payment when you want the verified emails and phone numbers
                  unlocked, or when you want to export the list. That way, you can judge the
                  quality of our data before you ever reach for your card.
                </p>
              </div>
            </article>

            {/* How we verify data */}
            <article>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand/10 ring-1 ring-inset ring-primary/20">
                  <Database className="h-5 w-5 text-cyan" />
                </div>
                <h2 className="font-display text-2xl font-bold text-white">
                  How we verify our data
                </h2>
              </div>
              <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
                <p>
                  Data quality is the entire product, so our verification pipeline runs in
                  several layers rather than relying on a single source of truth.
                </p>
                <p>
                  <strong className="text-white">Business discovery.</strong> We start by
                  querying live business listing data for the business type, city, and country
                  you specify, pulling the company name, address, category, Google rating, and
                  review count directly from current listings.
                </p>
                <p>
                  <strong className="text-white">Email discovery and verification.</strong> When a
                  business's email isn't publicly listed, we search the company's domain for the
                  most likely contact address and assign it a confidence score. Every email we
                  surface — whether discovered automatically or found directly — is run through a
                  deliverability check before it's marked as verified. We never show an email as
                  verified unless it has passed that check.
                </p>
                <p>
                  <strong className="text-white">Phone number validation.</strong> Phone numbers
                  are checked for correct formatting and validity for their country code. A
                  malformed or disconnected number is flagged rather than presented as good data.
                </p>
                <p>
                  <strong className="text-white">LinkedIn matching.</strong> Where possible, we
                  match each business to its official LinkedIn company page, giving you social
                  context before you ever make contact.
                </p>
                <p>
                  If any verification step fails or an external data source is temporarily
                  unavailable, we never silently fabricate a result. The field is simply left
                  empty rather than filled with a guess, because an empty field is honest and a
                  wrong one wastes your time.
                </p>
              </div>
            </article>

            {/* Quality policy */}
            <article>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand/10 ring-1 ring-inset ring-primary/20">
                  <BadgeCheck className="h-5 w-5 text-cyan" />
                </div>
                <h2 className="font-display text-2xl font-bold text-white">Our quality policy</h2>
              </div>
              <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
                <p>
                  We hold ourselves to a simple standard: if we wouldn't trust the data enough to
                  use it in our own outbound campaigns, we don't ship it to you. That standard
                  shows up in a few concrete commitments.
                </p>
                <ul className="ml-5 list-disc space-y-2">
                  <li>
                    We label the source and verification status of every email and phone number,
                    so you always know how confident to be in a given contact.
                  </li>
                  <li>
                    We do not sell static, pre-scraped lists. Every result is generated from a
                    live search at the moment you run it.
                  </li>
                  <li>
                    We offer refunds on Starter plan purchases if your exported list doesn't meet
                    the quality bar described on this page — see our FAQ and Terms of Service for
                    the specifics.
                  </li>
                  <li>
                    We continuously expand the data sources behind LeadFlow rather than relying on
                    a single provider, so a temporary outage in one source degrades quality
                    gracefully instead of breaking the product.
                  </li>
                </ul>
                <p>
                  Lead generation will never be a perfectly solved problem — businesses open,
                  close, and change contact details constantly. What we can promise is that we
                  treat every gap in our data as something to disclose, not hide, and that we keep
                  improving the pipeline behind LeadFlow every month.
                </p>
                <p>
                  If you ever run a search and the results don't look right, we want to hear about
                  it. Reach out through our{" "}
                  <a href="/contact" className="text-cyan underline-offset-4 hover:underline">
                    contact page
                  </a>{" "}
                  — feedback from real searches is how this product gets better.
                </p>
              </div>
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
