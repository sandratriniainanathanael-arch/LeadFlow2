import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getOrCreateDbUser, isPaidPlan } from "@/lib/auth";

const unlockSchema = z.object({
  searchId: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getOrCreateDbUser();
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (!isPaidPlan(user.plan)) {
    return NextResponse.json(
      { error: "Upgrade to Starter or Pro to unlock full lead details." },
      { status: 403 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = unlockSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const search = await db.search.findFirst({
    where: { id: parsed.data.searchId, userId: user.id },
  });
  if (!search) {
    return NextResponse.json({ error: "Search not found" }, { status: 404 });
  }

  const result = await db.lead.updateMany({
    where: { searchId: search.id },
    data: { isUnlocked: true },
  });

  await db.user.update({
    where: { id: user.id },
    data: { leadsUsedTotal: { increment: result.count } },
  });

  return NextResponse.json({ unlockedCount: result.count });
}
