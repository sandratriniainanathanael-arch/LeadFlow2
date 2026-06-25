import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { ALL_BLOG_POSTS } from "@/lib/data/blog-posts";

export const metadata: Metadata = {
  title: "Blog — Lead Generation & B2B Sales Insights | LeadFlow",
  description:
    "Practical guides on lead generation, B2B sales, cold emailing, and local business marketing from the LeadFlow team.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="border-b border-border/60 py-20">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
              The LeadFlow blog
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              Short, practical reads on lead generation, prospecting, and B2B sales.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto grid max-w-5xl gap-6 px-6 sm:grid-cols-2 lg:grid-cols-3">
            {ALL_BLOG_POSTS.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:border-cyan/40 hover:shadow-glow"
              >
                <Badge variant="cyan" className="mb-4 w-fit">{post.category}</Badge>
                <h2 className="font-display text-lg font-semibold leading-snug text-white group-hover:text-cyan">
                  {post.title}
                </h2>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{post.excerpt}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-cyan">
                  Read article <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
