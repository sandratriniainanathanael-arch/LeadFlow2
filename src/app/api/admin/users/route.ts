import { NextRequest, NextResponse } from "next/server";
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

export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") ?? "";
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const pageSize = 20;

  const where = query
    ? {
        OR: [
          { email: { contains: query, mode: "insensitive" as const } },
          { firstName: { contains: query, mode: "insensitive" as const } },
          { lastName: { contains: query, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    db.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { _count: { select: { searches: true, payments: true } } },
    }),
    db.user.count({ where }),
  ]);

  return NextResponse.json({ users, total, page, pageSize });
}

export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const { userId, plan, isAdmin } = body as { userId?: string; plan?: string; isAdmin?: boolean };

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const updated = await db.user.update({
    where: { id: userId },
    data: {
      ...(plan ? { plan: plan as "FREE" | "STARTER" | "PRO" } : {}),
      ...(typeof isAdmin === "boolean" ? { isAdmin } : {}),
    },
  });

  return NextResponse.json({ user: updated });
}
