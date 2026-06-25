import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { getOrCreateDbUser } from "@/lib/auth";

export async function GET() {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getOrCreateDbUser();
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const [searchCount, leadCount, exportCount, activeSub] = await Promise.all([
    db.search.count({ where: { userId: user.id } }),
    db.lead.count({ where: { search: { userId: user.id } } }),
    db.export.count({ where: { userId: user.id } }),
    db.subscription.findFirst({
      where: { userId: user.id, status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return NextResponse.json({
    user,
    usage: { searchCount, leadCount, exportCount },
    subscription: activeSub,
  });
}
