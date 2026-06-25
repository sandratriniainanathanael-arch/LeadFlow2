import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import * as XLSX from "xlsx";
import { db } from "@/lib/db";
import { getOrCreateDbUser, isPaidPlan } from "@/lib/auth";

const exportSchema = z.object({
  searchId: z.string().min(1),
  format: z.enum(["CSV", "XLSX"]),
});

const COLUMNS = [
  "Company",
  "Phone",
  "Email",
  "Website",
  "LinkedIn",
  "Google Rating",
  "Reviews",
  "Address",
] as const;

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
      { error: "Exporting requires a paid plan. Upgrade to unlock CSV/Excel export." },
      { status: 403 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = exportSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const search = await db.search.findFirst({
    where: { id: parsed.data.searchId, userId: user.id },
    include: { leads: true },
  });
  if (!search) {
    return NextResponse.json({ error: "Search not found" }, { status: 404 });
  }

  const rows = search.leads.map((lead) => [
    lead.companyName,
    lead.phone ?? "",
    lead.email ?? "",
    lead.website ?? "",
    lead.linkedin ?? "",
    lead.googleRating ?? "",
    lead.reviewCount ?? "",
    lead.address ?? "",
  ]);

  await db.export.create({
    data: {
      userId: user.id,
      searchId: search.id,
      format: parsed.data.format,
      leadCount: rows.length,
    },
  });

  if (parsed.data.format === "CSV") {
    const csvLines = [COLUMNS.join(","), ...rows.map((r) => r.map(escapeCsv).join(","))];
    const csv = csvLines.join("\n");
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="leadflow-${search.businessType}-${search.city}.csv"`,
      },
    });
  }

  // XLSX
  const worksheet = XLSX.utils.aoa_to_sheet([COLUMNS as unknown as string[], ...rows]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="leadflow-${search.businessType}-${search.city}.xlsx"`,
    },
  });
}

function escapeCsv(value: string | number): string {
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}
