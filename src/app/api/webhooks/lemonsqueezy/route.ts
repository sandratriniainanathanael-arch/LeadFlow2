import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import type { PlanType, SubscriptionStatus } from "@prisma/client";

function verifySignature(rawBody: string, signature: string | null, secret: string): boolean {
  if (!signature) return false;
  const hmac = crypto.createHmac("sha256", secret);
  const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
  const sig = Buffer.from(signature, "utf8");
  return digest.length === sig.length && crypto.timingSafeEqual(digest, sig);
}

function mapVariantToPlan(variantId: string | number): PlanType {
  const starter = process.env.LEMONSQUEEZY_VARIANT_ID_STARTER;
  const pro = process.env.LEMONSQUEEZY_VARIANT_ID_PRO;
  if (String(variantId) === starter) return "STARTER";
  if (String(variantId) === pro) return "PRO";
  return "PRO";
}

function mapLemonStatus(status: string): SubscriptionStatus {
  switch (status) {
    case "active":
      return "ACTIVE";
    case "cancelled":
      return "CANCELLED";
    case "expired":
      return "EXPIRED";
    case "past_due":
      return "PAST_DUE";
    case "paused":
      return "PAUSED";
    case "on_trial":
      return "TRIALING";
    default:
      return "ACTIVE";
  }
}

export async function POST(req: NextRequest) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  const rawBody = await req.text();
  const signature = req.headers.get("x-signature");

  if (!secret || !verifySignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  const eventName: string = payload.meta?.event_name;
  const customData = payload.meta?.custom_data ?? {};
  const userId: string | undefined = customData.user_id;

  if (!userId) {
    // Nothing we can attribute this event to — acknowledge and exit.
    return NextResponse.json({ received: true });
  }

  try {
    switch (eventName) {
      case "order_created": {
        const attrs = payload.data.attributes;
        const planType = mapVariantToPlan(attrs.first_order_item?.variant_id);

        await db.payment.create({
          data: {
            userId,
            lemonSqueezyOrderId: String(payload.data.id),
            amount: attrs.total ?? 0,
            currency: attrs.currency ?? "USD",
            status: attrs.status === "paid" ? "PAID" : "PENDING",
            planType,
            receiptUrl: attrs.urls?.receipt ?? null,
          },
        });

        if (attrs.status === "paid") {
          await db.user.update({
            where: { id: userId },
            data: { plan: planType },
          });

          await db.notification.create({
            data: {
              userId,
              title: "Payment received",
              message: `Your ${planType} plan is now active. Enjoy unlocked leads!`,
              type: "success",
            },
          });
        }
        break;
      }

      case "subscription_created":
      case "subscription_updated": {
        const attrs = payload.data.attributes;
        const planType = mapVariantToPlan(attrs.variant_id);
        const status = mapLemonStatus(attrs.status);

        await db.subscription.upsert({
          where: { lemonSqueezySubId: String(payload.data.id) },
          create: {
            userId,
            lemonSqueezySubId: String(payload.data.id),
            lemonSqueezyCustomerId: String(attrs.customer_id),
            variantId: String(attrs.variant_id),
            status,
            planType,
            renewsAt: attrs.renews_at ? new Date(attrs.renews_at) : null,
            endsAt: attrs.ends_at ? new Date(attrs.ends_at) : null,
            trialEndsAt: attrs.trial_ends_at ? new Date(attrs.trial_ends_at) : null,
          },
          update: {
            status,
            renewsAt: attrs.renews_at ? new Date(attrs.renews_at) : null,
            endsAt: attrs.ends_at ? new Date(attrs.ends_at) : null,
          },
        });

        await db.user.update({
          where: { id: userId },
          data: { plan: status === "ACTIVE" || status === "TRIALING" ? planType : "FREE" },
        });
        break;
      }

      case "subscription_cancelled":
      case "subscription_expired": {
        await db.subscription.updateMany({
          where: { lemonSqueezySubId: String(payload.data.id) },
          data: { status: eventName === "subscription_expired" ? "EXPIRED" : "CANCELLED" },
        });

        await db.user.update({
          where: { id: userId },
          data: { plan: "FREE" },
        });

        await db.notification.create({
          data: {
            userId,
            title: "Subscription ended",
            message: "Your LeadFlow Pro subscription has ended. You're now on the Free plan.",
            type: "warning",
          },
        });
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[webhooks/lemonsqueezy] processing error:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
