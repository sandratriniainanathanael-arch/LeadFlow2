import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getOrCreateDbUser, isPaidPlan } from "@/lib/auth";
import { maskEmail, maskPhone } from "@/lib/utils";
import { ResultsTable } from "@/components/dashboard/results-table";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function SearchResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getOrCreateDbUser();
  if (!user) notFound();

  const search = await db.search.findFirst({
    where: { id, userId: user.id },
    include: { leads: { orderBy: { createdAt: "asc" } } },
  });
  if (!search) notFound();

  const unlocked = isPaidPlan(user.plan);

  const leads = search.leads.map((lead) => {
    const isLocked = !(unlocked || lead.isUnlocked);
    return {
      id: lead.id,
      companyName: lead.companyName,
      phone: isLocked ? (lead.phone ? maskPhone(lead.phone) : null) : lead.phone,
      email: isLocked ? (lead.email ? maskEmail(lead.email) : null) : lead.email,
      website: lead.website,
      linkedin: lead.linkedin,
      googleRating: lead.googleRating,
      reviewCount: lead.reviewCount,
      address: lead.address,
      isLocked,
    };
  });

  return (
    <div className="space-y-6">
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-cyan">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to search
      </Link>

      <div>
        <h1 className="font-display text-2xl font-bold text-white">
          {search.businessType} in {search.city}, {search.country}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {search.resultCount} results · Status: {search.status}
        </p>
      </div>

      <ResultsTable searchId={search.id} leads={leads} />
    </div>
  );
}
