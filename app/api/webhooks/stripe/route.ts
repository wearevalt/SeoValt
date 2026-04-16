import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import type Stripe from "stripe";

// Disable body parsing — Stripe needs raw body for signature verification
export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Webhook verification failed";
    console.error("Stripe webhook error:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const supabase = await createClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        const plan = session.metadata?.plan ?? "free";

        if (userId && session.subscription) {
          const sub = await stripe.subscriptions.retrieve(
            session.subscription as string
          );

          // In Stripe v22, current_period_end is on subscription items not top-level
          const periodEnd = (sub.items?.data?.[0] as { current_period_end?: number })?.current_period_end;
          await supabase.from("users").update({
            plan,
            stripe_subscription_id: sub.id,
            subscription_status: "active",
            subscription_ends_at: periodEnd
              ? new Date(periodEnd * 1000).toISOString()
              : null,
          }).eq("id", userId);

          // Ensure user has at least one license
          const { data: licenses } = await supabase
            .from("licenses")
            .select("id")
            .eq("user_id", userId);

          if (!licenses?.length) {
            await supabase.from("licenses").insert({ user_id: userId, plan });
          } else {
            await supabase.from("licenses")
              .update({ plan, is_active: true })
              .eq("user_id", userId);
          }
        }
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.user_id;
        if (userId) {
          const statusMap: Record<string, string> = {
            active: "active",
            past_due: "past_due",
            canceled: "canceled",
            unpaid: "past_due",
          };
          const subPeriodEnd = (sub.items?.data?.[0] as { current_period_end?: number })?.current_period_end;
          await supabase.from("users").update({
            plan: sub.metadata?.plan ?? "free",
            subscription_status: statusMap[sub.status] ?? "inactive",
            subscription_ends_at: subPeriodEnd
              ? new Date(subPeriodEnd * 1000).toISOString()
              : null,
          }).eq("id", userId);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.user_id;
        if (userId) {
          await supabase.from("users").update({
            plan: "free",
            subscription_status: "canceled",
            stripe_subscription_id: null,
          }).eq("id", userId);
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = typeof invoice.customer === "string"
          ? invoice.customer
          : invoice.customer?.id;

        if (customerId) {
          await supabase
            .from("users")
            .update({ subscription_status: "past_due" })
            .eq("stripe_customer_id", customerId);
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    console.error("Webhook handler error:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
