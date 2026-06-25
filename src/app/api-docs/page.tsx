import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "API Documentation — LeadFlow",
  description: "Reference for the LeadFlow REST API endpoints.",
  alternates: { canonical: "/api-docs" },
};

const ENDPOINTS = [
  {
    method: "POST",
    path: "/api/search",
    desc: "Launch a new lead search for a business type, city, and country.",
    body: `{ "businessType": "Dentist", "city": "Paris", "country": "France" }`,
  },
  {
    method: "GET",
    path: "/api/search/:id",
    desc: "Retrieve a search and its leads. Locked fields are masked unless the account is on a paid plan.",
    body: null,
  },
  {
    method: "POST",
    path: "/api/leads/unlock",
    desc: "Unlock all leads for a given search (requires Starter or Pro plan).",
    body: `{ "searchId": "abc123" }`,
  },
  {
    method: "POST",
    path: "/api/export",
    desc: "Export a search's leads as CSV or XLSX.",
    body: `{ "searchId": "abc123", "format": "CSV" }`,
  },
];

export default function ApiDocsPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="py-20">
          <div className="mx-auto max-w-3xl px-6">
            <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">API documentation</h1>
            <p className="mt-4 text-muted-foreground">
              LeadFlow's REST API lets Pro accounts integrate lead search programmatically. Authenticate using your
              Clerk session cookie; a dedicated API key system is on our roadmap.
            </p>

            <div className="mt-10 space-y-6">
              {ENDPOINTS.map((e) => (
                <div key={e.path} className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center gap-3">
                    <Badge variant={e.method === "GET" ? "cyan" : "default"}>{e.method}</Badge>
                    <code className="text-sm text-white">{e.path}</code>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{e.desc}</p>
                  {e.body && (
                    <pre className="mt-3 overflow-x-auto rounded-xl bg-[#0E1730] p-3 text-xs text-cyan">
                      {e.body}
                    </pre>
                  )}
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
