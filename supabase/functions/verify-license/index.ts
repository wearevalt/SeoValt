// Supabase Edge Function: verify-license
// Called by the WordPress plugin to verify a license key
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { license_key, site_url } = await req.json();

    if (!license_key) {
      return new Response(
        JSON.stringify({ valid: false, error: "License key is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Look up the license
    const { data: license, error } = await supabase
      .from("licenses")
      .select("*, users(plan, subscription_status, subscription_ends_at)")
      .eq("license_key", license_key)
      .single();

    if (error || !license) {
      return new Response(
        JSON.stringify({ valid: false, error: "Invalid license key" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!license.is_active) {
      return new Response(
        JSON.stringify({ valid: false, error: "License is inactive" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // If site_url is provided and license already has one, verify they match
    if (site_url && license.site_url && license.site_url !== site_url) {
      return new Response(
        JSON.stringify({ valid: false, error: "License is bound to a different site" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Bind site_url if not set yet
    if (site_url && !license.site_url) {
      await supabase
        .from("licenses")
        .update({ site_url, activated_at: new Date().toISOString() })
        .eq("id", license.id);
    }

    // Update last_used_at
    await supabase
      .from("licenses")
      .update({ last_used_at: new Date().toISOString() })
      .eq("id", license.id);

    const user = license.users as { plan: string; subscription_status: string; subscription_ends_at: string | null };

    // Check subscription status for paid plans
    if (user.plan !== "free" && user.subscription_status !== "active") {
      return new Response(
        JSON.stringify({
          valid: false,
          error: "Subscription is not active",
          subscription_status: user.subscription_status,
        }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get quota
    const { data: quota } = await supabase.rpc("check_quota", {
      p_user_id: license.user_id,
      p_action: "generate_article",
    });

    return new Response(
      JSON.stringify({
        valid: true,
        license_id: license.id,
        user_id: license.user_id,
        plan: user.plan,
        quota,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ valid: false, error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
