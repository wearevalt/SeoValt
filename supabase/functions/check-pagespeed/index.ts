// Supabase Edge Function: check-pagespeed
// Calls Google PageSpeed Insights API
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
    const { license_key, url, strategy = "mobile" } = await req.json();

    if (!license_key || !url) {
      return new Response(
        JSON.stringify({ error: "license_key and url are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Verify license
    const { data: license } = await supabase
      .from("licenses")
      .select("id, user_id, is_active")
      .eq("license_key", license_key)
      .single();

    if (!license?.is_active) {
      return new Response(
        JSON.stringify({ error: "Invalid or inactive license" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check quota
    const { data: quotaCheck } = await supabase.rpc("check_quota", {
      p_user_id: license.user_id,
      p_action: "check_pagespeed",
    });

    if (!quotaCheck?.allowed) {
      return new Response(
        JSON.stringify({ error: "PageSpeed quota exceeded" }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Call Google PageSpeed API
    const apiKey = Deno.env.get("GOOGLE_PAGESPEED_API_KEY");
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}&key=${apiKey}&category=performance&category=accessibility&category=seo`;

    const psResponse = await fetch(apiUrl);
    const psData = await psResponse.json();

    if (psData.error) {
      throw new Error(psData.error.message);
    }

    const categories = psData.lighthouseResult?.categories ?? {};
    const audits = psData.lighthouseResult?.audits ?? {};

    const result = {
      url,
      strategy,
      scores: {
        performance:   Math.round((categories.performance?.score ?? 0) * 100),
        accessibility: Math.round((categories.accessibility?.score ?? 0) * 100),
        seo:           Math.round((categories.seo?.score ?? 0) * 100),
      },
      metrics: {
        lcp: audits["largest-contentful-paint"]?.displayValue,
        inp: audits["interactive"]?.displayValue,
        cls: audits["cumulative-layout-shift"]?.displayValue,
        fcp: audits["first-contentful-paint"]?.displayValue,
        ttfb: audits["server-response-time"]?.displayValue,
        speed_index: audits["speed-index"]?.displayValue,
      },
      opportunities: Object.values(audits)
        .filter((a: unknown) => {
          const audit = a as { score?: number; details?: { type?: string } };
          return (audit.score ?? 1) < 0.9 && audit.details?.type === "opportunity";
        })
        .slice(0, 5)
        .map((a: unknown) => {
          const audit = a as { title?: string; description?: string; displayValue?: string };
          return ({
            title: audit.title,
            description: audit.description,
            savings: audit.displayValue,
          });
        }),
    };

    // Log usage
    await supabase.from("usage_logs").insert({
      user_id: license.user_id,
      license_id: license.id,
      action: "check_pagespeed",
      credits_used: 1,
      metadata: { url, strategy },
    });

    await supabase.rpc("increment_usage", {
      p_user_id: license.user_id,
      p_action: "check_pagespeed",
    });

    return new Response(
      JSON.stringify({ success: true, result }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
