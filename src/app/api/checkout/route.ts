import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { getOrCreateDbUser } from "@/lib/auth";
import { createLemonSqueezyCheckout, type PlanKey } from "@/lib/lemonsqueezy";

const checkoutSchema = z.object({
  plan: z.enum(["STARTER", "PRO"]),
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
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid plan selected" }, { status: 400 });
  }

  try {
    const checkoutUrl = await createLemonSqueezyCheckout({
      plan: parsed.data.plan as PlanKey,
      userEmail: user.email,
      userId: user.id,
    });

    if (!checkoutUrl) {
      return NextResponse.json({ error: "Could not create checkout session" }, { status: 502 });
    }

    return NextResponse.json({ url: checkoutUrl });
  } catch (err) {
    console.error("[api/checkout] error:", err);
    const message = err instanceof Error ? err.message : "Checkout creation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
