import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Percent, Link2, Wallet } from "lucide-react";

export const metadata: Metadata = {
  title: "Affiliate Program — LeadFlow",
  description: "Earn recurring commission promoting LeadFlow's B2B lead generation platform.",
  alternates: { canonical: "/affiliate" },
};

const STEPS = [
  { icon: Link2, title: "Get your link", body: "Sign up and receive a unique referral link to share with your audience." },
  { icon: Percent, title: "Earn 30% commission", body: "Get 30% of every payment made by customers you refer, for the lifetime of their subscription." },
  { icon: Wallet, title: "Get paid monthly", body: "Commissions are paid out monthly once you reach the $50 payout threshold." },
];

export default function AffiliatePage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="border-b border-border/60 py-20 text-center">
          <div className="mx-auto max-w-2xl px-6">
            <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">
              Earn 30% recurring with the LeadFlow affiliate program
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              Refer customers to LeadFlow and earn commission on every Starter purchase and Pro subscription.
            </p>
            <Button size="lg" className="mt-8" asChild>
              <a href="/sign-up">Join the program</a>
            </Button>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto grid max-w-4xl gap-6 px-6 sm:grid-cols-3">
            {STEPS.map((s) => (
              <Card key={s.title}>
                <CardContent className="p-6">
                  <s.icon className="h-6 w-6 text-cyan" />
                  <h3 className="mt-4 font-display font-semibold text-white">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
