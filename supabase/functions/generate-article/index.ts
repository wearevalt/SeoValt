// Supabase Edge Function: generate-article
// Uses Anthropic Claude to generate SEO-optimized blog articles
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
    const {
      license_key,
      keyword,
      niche,
      language = "en",
      tone = "professional",
      word_count = 1200,
    } = await req.json();

    if (!license_key || !keyword) {
      return new Response(
        JSON.stringify({ error: "license_key and keyword are required" }),
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
      p_action: "generate_article",
    });

    if (!quotaCheck?.allowed) {
      return new Response(
        JSON.stringify({ error: "Monthly article quota exceeded", quota: quotaCheck }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate article with Claude
    const anthropic = new Anthropic({ apiKey: Deno.env.get("ANTHROPIC_API_KEY")! });

    const systemPrompt = `You are an expert SEO content writer. Generate highly SEO-optimized blog articles.
Always respond with valid JSON matching the exact schema specified. No markdown, no extra text.`;

    const userPrompt = `Generate a complete SEO-optimized blog article about: "${keyword}"
Niche: ${niche || "general"}
Language: ${language}
Tone: ${tone}
Target word count: ${word_count}

Respond with this exact JSON structure:
{
  "title": "SEO-optimized title (50-60 chars)",
  "meta_description": "Compelling meta description (150-160 chars)",
  "slug": "url-friendly-slug",
  "excerpt": "2-3 sentence article summary",
  "content": "Full HTML article content with proper H2, H3 headings, paragraphs",
  "focus_keyword": "${keyword}",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "schema": {
    "@type": "Article",
    "headline": "same as title",
    "description": "same as meta_description"
  },
  "alt_texts": ["suggested alt text for image 1", "suggested alt text for image 2"],
  "internal_link_suggestions": ["anchor text 1", "anchor text 2"],
  "word_count": ${word_count}
}`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const articleJson = JSON.parse(
      (message.content[0] as { type: string; text: string }).text
    );

    // Log usage
    await supabase.from("usage_logs").insert({
      user_id: license.user_id,
      license_id: license.id,
      action: "generate_article",
      credits_used: 1,
      metadata: { keyword, niche, language },
    });

    await supabase.rpc("increment_usage", {
      p_user_id: license.user_id,
      p_action: "generate_article",
    });

    // Update last_used_at
    await supabase
      .from("licenses")
      .update({ last_used_at: new Date().toISOString() })
      .eq("id", license.id);

    return new Response(
      JSON.stringify({ success: true, article: articleJson }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
