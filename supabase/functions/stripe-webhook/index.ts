// Supabase Edge Function: stripe-webhook
// Handles Stripe webhook events to sync subscription status
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

serve(async (req) => {
  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
    apiVersion: "2025-03-31.basil",
  });

  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, sig!, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new Response(JSON.stringify({ error: "Invalid signature" }), { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const planFromMetadata = (metadata: Stripe.Metadata): string => {
    return metadata?.plan ?? "free";
  };

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        const plan = session.metadata?.plan ?? "free";
        if (!userId) break;

        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );

        await supabase.from("users").update({
          plan,
          stripe_subscription_id: subscription.id,
          subscription_status: "active",
          subscription_ends_at: new Date(subscription.current_period_end * 1000).toISOString(),
        }).eq("id", userId);

        // Create license if user doesn't have one for this plan
        const { data: existingLicenses } = await supabase
          .from("licenses")
          .select("id")
          .eq("user_id", userId);

        if (!existingLicenses?.length) {
          await supabase.from("licenses").insert({ user_id: userId, plan });
        } else {
          // Update existing licenses to new plan
          await supabase.from("licenses")
            .update({ plan, is_active: true })
            .eq("user_id", userId);
        }
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.user_id;
        if (!userId) break;

        const plan = planFromMetadata(sub.metadata);
        await supabase.from("users").update({
          plan,
          subscription_status: sub.status === "active" ? "active" :
                               sub.status === "past_due" ? "past_due" : "canceled",
          subscription_ends_at: new Date(sub.current_period_end * 1000).toISOString(),
        }).eq("id", userId);
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.user_id;
        if (!userId) break;

        await supabase.from("users").update({
          plan: "free",
          subscription_status: "canceled",
          stripe_subscription_id: null,
        }).eq("id", userId);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        const { data: user } = await supabase
          .from("users")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (user) {
          await supabase.from("users")
            .update({ subscription_status: "past_due" })
            .eq("id", user.id);
        }
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
