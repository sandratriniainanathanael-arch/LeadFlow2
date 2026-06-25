import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { db } from "@/lib/db";

interface ClerkWebhookEvent {
  type: string;
  data: {
    id: string;
    email_addresses?: { email_address: string }[];
    first_name?: string | null;
    last_name?: string | null;
    image_url?: string | null;
  };
}

export async function POST(req: NextRequest) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  const rawBody = await req.text();
  const headers = {
    "svix-id": req.headers.get("svix-id") ?? "",
    "svix-timestamp": req.headers.get("svix-timestamp") ?? "",
    "svix-signature": req.headers.get("svix-signature") ?? "",
  };

  let event: ClerkWebhookEvent;
  try {
    const wh = new Webhook(secret);
    event = wh.verify(rawBody, headers) as ClerkWebhookEvent;
  } catch (err) {
    console.error("[webhooks/clerk] signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  try {
    switch (event.type) {
      case "user.created": {
        const email = event.data.email_addresses?.[0]?.email_address ?? "";
        await db.user.upsert({
          where: { clerkId: event.data.id },
          create: {
            clerkId: event.data.id,
            email,
            firstName: event.data.first_name,
            lastName: event.data.last_name,
            imageUrl: event.data.image_url,
          },
          update: {},
        });
        break;
      }

      case "user.updated": {
        const email = event.data.email_addresses?.[0]?.email_address;
        await db.user.updateMany({
          where: { clerkId: event.data.id },
          data: {
            ...(email ? { email } : {}),
            firstName: event.data.first_name,
            lastName: event.data.last_name,
            imageUrl: event.data.image_url,
          },
        });
        break;
      }

      case "user.deleted": {
        await db.user.deleteMany({ where: { clerkId: event.data.id } });
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[webhooks/clerk] processing error:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
