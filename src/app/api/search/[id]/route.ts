import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { getOrCreateDbUser, isPaidPlan } from "@/lib/auth";
import { maskEmail, maskPhone } from "@/lib/utils";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getOrCreateDbUser();
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { id } = await params;

  const search = await db.search.findFirst({
    where: { id, userId: user.id },
    include: { leads: { orderBy: { createdAt: "asc" } } },
  });

  if (!search) {
    return NextResponse.json({ error: "Search not found" }, { status: 404 });
  }

  const unlocked = isPaidPlan(user.plan);

  const leads = search.leads.map((lead) => ({
    ...lead,
    email: unlocked || lead.isUnlocked ? lead.email : lead.email ? maskEmail(lead.email) : null,
    phone: unlocked || lead.isUnlocked ? lead.phone : lead.phone ? maskPhone(lead.phone) : null,
    isLocked: !(unlocked || lead.isUnlocked),
  }));

  return NextResponse.json({ search: { ...search, leads } });
}
