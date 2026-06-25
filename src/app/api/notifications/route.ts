import { NextRequest, NextResponse } from "next/server";
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

  const notifications = await db.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  return NextResponse.json({ notifications });
}

export async function PATCH(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getOrCreateDbUser();
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => ({}));
  const { id, markAllRead } = body as { id?: string; markAllRead?: boolean };

  if (markAllRead) {
    await db.notification.updateMany({ where: { userId: user.id, read: false }, data: { read: true } });
    return NextResponse.json({ success: true });
  }

  if (id) {
    await db.notification.updateMany({ where: { id, userId: user.id }, data: { read: true } });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
}
