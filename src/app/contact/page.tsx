import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ContactForm } from "@/components/marketing/contact-form";
import { Mail, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact — LeadFlow",
  description: "Get in touch with the LeadFlow team for support, billing, or partnership questions.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="py-20">
          <div className="mx-auto grid max-w-4xl gap-10 px-6 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">Contact us</h1>
              <p className="mt-4 text-muted-foreground">
                Questions about pricing, data quality, or your account? Send us a message and we'll respond fast.
              </p>

              <div className="mt-8 space-y-4 text-sm">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="h-4 w-4 text-cyan" /> support@leadflow.app
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Clock className="h-4 w-4 text-cyan" /> Replies within 1 business day · Pro gets priority support
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <ContactForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
