import { db } from "@/lib/db";
import { getOrCreateDbUser } from "@/lib/auth";
import { SearchForm } from "@/components/dashboard/search-form";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default async function DashboardPage() {
  const user = await getOrCreateDbUser();
  const recentSearches = user
    ? await db.search.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 5,
      })
    : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Find new leads</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter a business type, city, and country to launch a search.
        </p>
      </div>

      <SearchForm />

      {recentSearches.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Recent searches
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {recentSearches.map((s) => (
              <Link key={s.id} href={`/dashboard/results/${s.id}`}>
                <Card className="transition-colors hover:border-cyan/40">
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium text-white">
                        {s.businessType} — {s.city}, {s.country}
                      </p>
                      <p className="text-xs text-muted-foreground">{s.resultCount} leads · {s.status}</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-cyan" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
