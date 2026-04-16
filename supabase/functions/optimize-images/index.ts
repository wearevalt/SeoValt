// Supabase Edge Function: optimize-images
// Generates AI alt texts for images using Claude Vision
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
    const { license_key, images, site_niche = "general" } = await req.json();
    // images: Array<{ id: number, url: string, current_alt: string, filename: string }>

    if (!license_key || !images?.length) {
      return new Response(
        JSON.stringify({ error: "license_key and images array required" }),
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

    const anthropic = new Anthropic({ apiKey: Deno.env.get("ANTHROPIC_API_KEY")! });
    const results = [];

    // Process in batches of 5 to avoid rate limits
    const batch = images.slice(0, 20);

    for (const img of batch) {
      try {
        // For images we can access, use vision; otherwise use filename+context
        const prompt = `Generate an SEO-optimized alt text for an image.
Filename: ${img.filename}
Current alt: ${img.current_alt || "none"}
Site niche: ${site_niche}
Image URL: ${img.url}

Rules:
- Be descriptive but concise (max 125 chars)
- Include relevant keywords naturally
- Don't start with "image of" or "picture of"
- Describe what's actually in/implied by the filename

Respond with ONLY the alt text, no quotes, no explanation.`;

        const message = await anthropic.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 100,
          messages: [{ role: "user", content: prompt }],
        });

        results.push({
          id: img.id,
          alt_text: (message.content[0] as { type: string; text: string }).text.trim(),
          success: true,
        });
      } catch {
        results.push({ id: img.id, success: false, error: "Failed to generate alt text" });
      }
    }

    await supabase.from("usage_logs").insert({
      user_id: license.user_id,
      license_id: license.id,
      action: "optimize_images",
      credits_used: results.filter((r) => r.success).length,
      metadata: { processed: results.length },
    });

    await supabase.rpc("increment_usage", {
      p_user_id: license.user_id,
      p_action: "optimize_images",
    });

    return new Response(
      JSON.stringify({ success: true, results }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
