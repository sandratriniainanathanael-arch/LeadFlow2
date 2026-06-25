import { Users, Search, Database, DollarSign } from "lucide-react";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/admin/stat-card";
import { SearchesChart } from "@/components/admin/searches-chart";
import { formatCurrency, formatNumber } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [totalUsers, totalSearches, totalLeads, paidUsers, revenue, recentPayments, searches] = await Promise.all([
    db.user.count(),
    db.search.count(),
    db.lead.count(),
    db.user.count({ where: { plan: { in: ["STARTER", "PRO"] } } }),
    db.payment.aggregate({ where: { status: "PAID" }, _sum: { amount: true } }),
    db.payment.findMany({
      where: { status: "PAID" },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { user: { select: { email: true } } },
    }),
    db.search.findMany({ where: { createdAt: { gte: thirtyDaysAgo } }, select: { createdAt: true } }),
  ]);

  const buckets: Record<string, number> = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    buckets[d.toISOString().slice(0, 10)] = 0;
  }
  for (const s of searches) {
    const key = s.createdAt.toISOString().slice(0, 10);
    if (key in buckets) buckets[key]++;
  }
  const chartData = Object.entries(buckets).map(([date, count]) => ({ date, count }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Admin overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">Platform-wide analytics and revenue.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total users" value={formatNumber(totalUsers)} icon={Users} accent="cyan" />
        <StatCard label="Total searches" value={formatNumber(totalSearches)} icon={Search} accent="primary" />
        <StatCard label="Leads generated" value={formatNumber(totalLeads)} icon={Database} accent="cyan" />
        <StatCard label="Revenue" value={formatCurrency(revenue._sum.amount ?? 0)} icon={DollarSign} accent="success" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Searches — last 30 days</CardTitle>
        </CardHeader>
        <CardContent>
          <SearchesChart data={chartData} />
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent payments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentPayments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No payments yet.</p>
            ) : (
              recentPayments.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-xl border border-border p-3 text-sm">
                  <div>
                    <p className="font-medium text-white">{p.user.email}</p>
                    <p className="text-xs text-muted-foreground">{p.planType}</p>
                  </div>
                  <span className="font-medium text-success">{formatCurrency(p.amount, p.currency)}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Plan distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Paid users: <span className="font-medium text-white">{formatNumber(paidUsers)}</span></p>
            <p>Free users: <span className="font-medium text-white">{formatNumber(totalUsers - paidUsers)}</span></p>
            <p>Conversion rate: <span className="font-medium text-white">{totalUsers > 0 ? ((paidUsers / totalUsers) * 100).toFixed(1) : "0"}%</span></p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
