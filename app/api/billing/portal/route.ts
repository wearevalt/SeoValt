import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("users")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    if (!profile?.stripe_customer_id) {
      return NextResponse.json({ error: "No billing account found" }, { status: 404 });
    }

    const origin = req.headers.get("origin") ?? "https://seovalt.io";

    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id as string,
      return_url: `${origin}/en/dashboard/billing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to open portal" },
      { status: 500 }
    );
  }
}
