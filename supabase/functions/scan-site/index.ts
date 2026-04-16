// Supabase Edge Function: scan-site
// Full site SEO audit using Claude analysis
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Anthropic from "https://esm.sh/@anthropic-ai/sdk@0.24.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { license_key, site_data } = await req.json();
    // site_data: { url, posts_count, pages, products, categories, menus, robots_txt, sitemap_url }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

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

    const anthropic = new Anthropic({ apiKey: Deno.env.get("ANTHROPIC_API_KEY")! });

    const prompt = `You are an expert SEO auditor. Analyze this WordPress site data and provide a comprehensive SEO audit.

Site: ${site_data.url}
Posts: ${site_data.posts_count}
Pages: ${JSON.stringify(site_data.pages?.slice(0, 5))}
Categories: ${JSON.stringify(site_data.categories?.slice(0, 5))}
Has sitemap: ${!!site_data.sitemap_url}
Robots.txt excerpt: ${(site_data.robots_txt || "").slice(0, 200)}

Respond ONLY with valid JSON:
{
  "overall_score": 0-100,
  "business_type": "blog|ecommerce|corporate|portfolio|news",
  "niche": "detected niche",
  "critical_issues": ["issue1", "issue2"],
  "warnings": ["warning1", "warning2"],
  "opportunities": ["opportunity1", "opportunity2"],
  "recommended_keywords": ["kw1", "kw2", "kw3", "kw4", "kw5"],
  "action_plan": [
    {"priority": 1, "action": "...", "impact": "high|medium|low"},
    {"priority": 2, "action": "...", "impact": "high|medium|low"}
  ]
}`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    });

    const audit = JSON.parse(
      (message.content[0] as { type: string; text: string }).text
    );

    await supabase.from("usage_logs").insert({
      user_id: license.user_id,
      license_id: license.id,
      action: "scan_site",
      credits_used: 3,
      metadata: { url: site_data.url, score: audit.overall_score },
    });

    return new Response(
      JSON.stringify({ success: true, audit }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
