import { NextResponse } from "next/server";
import { stripe, STRIPE_PRICE_IDS } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan, interval = "monthly" } = await req.json();

    const priceIdKey = `${plan}_${interval}` as keyof typeof STRIPE_PRICE_IDS;
    const priceId = STRIPE_PRICE_IDS[priceIdKey];

    if (!priceId) {
      return NextResponse.json({ error: "Invalid plan or interval" }, { status: 400 });
    }

    const { data: profile } = await supabase
      .from("users")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    let customerId = profile?.stripe_customer_id as string | undefined;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { user_id: user.id },
      });
      customerId = customer.id;
      await supabase
        .from("users")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }

    const origin = req.headers.get("origin") ?? process.env.NEXT_PUBLIC_APP_URL ?? "https://seovalt.io";

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/en/dashboard/billing?success=true`,
      cancel_url: `${origin}/en/dashboard/billing?canceled=true`,
      metadata: { user_id: user.id, plan, interval },
      subscription_data: { metadata: { user_id: user.id, plan } },
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    console.error("Create checkout error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create checkout" },
      { status: 500 }
    );
  }
}
