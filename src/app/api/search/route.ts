import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getOrCreateDbUser, planLimits } from "@/lib/auth";
import { runLeadPipeline } from "@/lib/lead-pipeline";

const searchSchema = z.object({
  businessType: z.string().trim().min(2, "Business type is required").max(80),
  city: z.string().trim().min(2, "City is required").max(80),
  country: z.string().trim().min(2, "Country is required").max(80),
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

  const body = await req.json().catch(() => null);
  const parsed = searchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  // Enforce free-plan monthly search quota
  const limits = planLimits(user.plan);
  if (limits.searchesPerMonth !== Infinity) {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const searchesThisMonth = await db.search.count({
      where: { userId: user.id, createdAt: { gte: startOfMonth } },
    });

    if (searchesThisMonth >= limits.searchesPerMonth) {
      return NextResponse.json(
        { error: "You've reached your free monthly search limit. Upgrade to continue searching." },
        { status: 403 }
      );
    }
  }

  const { businessType, city, country } = parsed.data;

  const search = await db.search.create({
    data: { userId: user.id, businessType, city, country, status: "RUNNING" },
  });

  try {
    const leads = await runLeadPipeline({ businessType, city, country });

    await db.lead.createMany({
      data: leads.map((lead) => ({
        searchId: search.id,
        companyName: lead.companyName,
        phone: lead.phone ?? null,
        email: lead.email ?? null,
        website: lead.website ?? null,
        linkedin: lead.linkedin ?? null,
        googleRating: lead.googleRating ?? null,
        reviewCount: lead.reviewCount ?? null,
        address: lead.address ?? null,
        city: lead.city ?? city,
        country: lead.country ?? country,
        category: lead.category ?? businessType,
        emailVerified: lead.emailVerified ?? false,
        phoneVerified: lead.phoneVerified ?? false,
        source: lead.source,
        isUnlocked: false,
      })),
    });

    const completed = await db.search.update({
      where: { id: search.id },
      data: { status: "COMPLETED", resultCount: leads.length, completedAt: new Date() },
      include: { leads: true },
    });

    return NextResponse.json({ search: completed });
  } catch (err) {
    console.error("[api/search] pipeline failed:", err);
    await db.search.update({
      where: { id: search.id },
      data: { status: "FAILED", errorMessage: "Lead pipeline failed. Please try again." },
    });
    return NextResponse.json({ error: "Search failed. Please try again." }, { status: 500 });
  }
}

export async function GET() {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getOrCreateDbUser();
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const searches = await db.search.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
    include: { _count: { select: { leads: true } } },
  });

  return NextResponse.json({ searches });
}
