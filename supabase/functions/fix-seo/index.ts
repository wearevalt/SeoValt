// Supabase Edge Function: fix-seo
// Uses Claude to analyze and generate SEO fixes for a page
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
    const { license_key, page_data } = await req.json();
    // page_data: { title, meta_description, h1, content, slug, url, focus_keyword }

    if (!license_key || !page_data) {
      return new Response(
        JSON.stringify({ error: "license_key and page_data are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

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

    const { data: quotaCheck } = await supabase.rpc("check_quota", {
      p_user_id: license.user_id,
      p_action: "fix_seo",
    });

    if (!quotaCheck?.allowed) {
      return new Response(
        JSON.stringify({ error: "SEO fix quota exceeded" }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const anthropic = new Anthropic({ apiKey: Deno.env.get("ANTHROPIC_API_KEY")! });

    const prompt = `You are an SEO expert. Analyze this page data and provide specific fixes.

Page data:
- URL: ${page_data.url}
- Title: ${page_data.title || "MISSING"}
- Meta description: ${page_data.meta_description || "MISSING"}
- H1: ${page_data.h1 || "MISSING"}
- Slug: ${page_data.slug}
- Focus keyword: ${page_data.focus_keyword || "none"}
- Content preview (first 500 chars): ${(page_data.content || "").slice(0, 500)}

Respond ONLY with valid JSON:
{
  "issues": [
    {"type": "title|meta|h1|slug|keyword_density|alt_text", "severity": "error|warning|info", "message": "..."}
  ],
  "fixes": {
    "title": "improved title or null",
    "meta_description": "improved meta or null",
    "h1": "improved H1 or null",
    "slug": "improved slug or null",
    "focus_keyword": "suggested focus keyword"
  },
  "score": 0-100,
  "summary": "Brief 1-sentence summary"
}`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const fixes = JSON.parse(
      (message.content[0] as { type: string; text: string }).text
    );

    await supabase.from("usage_logs").insert({
      user_id: license.user_id,
      license_id: license.id,
      action: "fix_seo",
      credits_used: 1,
      metadata: { url: page_data.url, score: fixes.score },
    });

    await supabase.rpc("increment_usage", {
      p_user_id: license.user_id,
      p_action: "fix_seo",
    });

    return new Response(
      JSON.stringify({ success: true, fixes }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
