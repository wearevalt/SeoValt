// Supabase Edge Function: create-checkout
// Creates a Stripe Checkout session for plan upgrades
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PRICE_IDS: Record<string, Record<string, string>> = {
  pro: {
    monthly: Deno.env.get("STRIPE_PRICE_PRO_MONTHLY") ?? "",
    yearly:  Deno.env.get("STRIPE_PRICE_PRO_YEARLY")  ?? "",
  },
  agency: {
    monthly: Deno.env.get("STRIPE_PRICE_AGENCY_MONTHLY") ?? "",
    yearly:  Deno.env.get("STRIPE_PRICE_AGENCY_YEARLY")  ?? "",
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No auth header");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error("Not authenticated");

    const { plan, interval = "monthly" } = await req.json();
    const priceId = PRICE_IDS[plan]?.[interval];
    if (!priceId) throw new Error("Invalid plan/interval");

    // Get or create Stripe customer
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: profile } = await supabaseAdmin
      .from("users")
      .select("stripe_customer_id, email")
      .eq("id", user.id)
      .single();

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
      apiVersion: "2025-03-31.basil",
    });

    let customerId = profile?.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email ?? profile?.email,
        metadata: { user_id: user.id },
      });
      customerId = customer.id;
      await supabaseAdmin
        .from("users")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }

    const origin = req.headers.get("origin") ?? "https://seovalt.io";

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/dashboard/billing?success=true`,
      cancel_url: `${origin}/dashboard/billing?canceled=true`,
      metadata: { user_id: user.id, plan, interval },
      subscription_data: { metadata: { user_id: user.id, plan } },
      allow_promotion_codes: true,
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
