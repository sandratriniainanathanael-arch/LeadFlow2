import Link from "next/link";
import { db } from "@/lib/db";
import { getOrCreateDbUser } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";

const STATUS_VARIANT = {
  COMPLETED: "success",
  RUNNING: "cyan",
  PENDING: "muted",
  FAILED: "destructive",
} as const;

export default async function HistoryPage() {
  const user = await getOrCreateDbUser();
  const searches = user
    ? await db.search.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 50,
      })
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Search history</h1>
        <p className="mt-1 text-sm text-muted-foreground">All your past lead searches.</p>
      </div>

      {searches.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            No searches yet. Launch your first one from the Search tab.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {searches.map((s) => (
            <Link key={s.id} href={`/dashboard/results/${s.id}`}>
              <Card className="transition-colors hover:border-cyan/40">
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium text-white">
                      {s.businessType} — {s.city}, {s.country}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(s.createdAt).toLocaleDateString()} · {s.resultCount} leads
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={STATUS_VARIANT[s.status]}>{s.status}</Badge>
                    <ArrowUpRight className="h-4 w-4 text-cyan" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
