import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { getOrCreateDbUser } from "@/lib/auth";

async function requireAdmin() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;
  const user = await getOrCreateDbUser();
  if (!user?.isAdmin) return null;
  return user;
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    totalUsers,
    totalSearches,
    totalLeads,
    totalExports,
    paidUsers,
    revenueResult,
    recentPayments,
    usersByPlan,
    searchesPerDay,
  ] = await Promise.all([
    db.user.count(),
    db.search.count(),
    db.lead.count(),
    db.export.count(),
    db.user.count({ where: { plan: { in: ["STARTER", "PRO"] } } }),
    db.payment.aggregate({ where: { status: "PAID" }, _sum: { amount: true } }),
    db.payment.findMany({
      where: { status: "PAID" },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { user: { select: { email: true } } },
    }),
    db.user.groupBy({ by: ["plan"], _count: { plan: true } }),
    db.search.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true },
    }),
  ]);

  // Bucket searches by day for the last 30 days
  const dailyBuckets: Record<string, number> = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dailyBuckets[d.toISOString().slice(0, 10)] = 0;
  }
  for (const s of searchesPerDay) {
    const key = s.createdAt.toISOString().slice(0, 10);
    if (key in dailyBuckets) dailyBuckets[key]++;
  }

  return NextResponse.json({
    totalUsers,
    totalSearches,
    totalLeads,
    totalExports,
    paidUsers,
    totalRevenueCents: revenueResult._sum.amount ?? 0,
    recentPayments,
    usersByPlan,
    searchesByDay: Object.entries(dailyBuckets).map(([date, count]) => ({ date, count })),
  });
}
