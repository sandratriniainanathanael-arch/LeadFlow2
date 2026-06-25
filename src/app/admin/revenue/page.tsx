import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

const STATUS_VARIANT = {
  PAID: "success",
  PENDING: "muted",
  FAILED: "destructive",
  REFUNDED: "muted",
} as const;

export default async function AdminRevenuePage() {
  const payments = await db.payment.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { user: { select: { email: true } } },
  });

  const totalRevenue = payments.filter((p) => p.status === "PAID").reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Revenue & payments</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Total revenue to date: <span className="font-semibold text-success">{formatCurrency(totalRevenue)}</span>
        </p>
      </div>

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Plan</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No payments yet.</td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id} className="border-b border-border/60 last:border-0">
                    <td className="px-4 py-3 text-white">{p.user.email}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.planType}</td>
                    <td className="px-4 py-3 font-medium text-white">{formatCurrency(p.amount, p.currency)}</td>
                    <td className="px-4 py-3"><Badge variant={STATUS_VARIANT[p.status]}>{p.status}</Badge></td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(p.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
