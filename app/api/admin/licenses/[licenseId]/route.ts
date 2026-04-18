import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/auth/admin";

type AdminAction =
  | { action: "toggle_active"; isActive: boolean }
  | { action: "reset_domain" }
  | { action: "update_notes"; notes: string }
  | { action: "update_expiry"; expiresAt: string | null };

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ licenseId: string }> }
) {
  try {
    const { licenseId } = await context.params;
    if (!licenseId) {
      return badRequest("License ID is required.");
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isAdminEmail(user.email)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const payload = (await request.json()) as AdminAction;
    const updates: Record<string, unknown> = {};

    switch (payload.action) {
      case "toggle_active":
        updates.is_active = Boolean(payload.isActive);
        break;
      case "reset_domain":
        updates.site_url = null;
        updates.activated_at = null;
        break;
      case "update_notes":
        updates.admin_notes = payload.notes.trim().slice(0, 2000);
        break;
      case "update_expiry":
        if (payload.expiresAt === null) {
          updates.expires_at = null;
        } else {
          const parsed = new Date(payload.expiresAt);
          if (Number.isNaN(parsed.getTime())) {
            return badRequest("Invalid expiration date.");
          }
          updates.expires_at = parsed.toISOString();
        }
        break;
      default:
        return badRequest("Unsupported admin action.");
    }

    const admin = createAdminClient();
    const { error: updateError } = await admin
      .from("licenses")
      .update(updates)
      .eq("id", licenseId);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    const { data: license, error: fetchError } = await admin
      .from("licenses")
      .select(`
        id,
        user_id,
        license_key,
        site_url,
        plan,
        is_active,
        activated_at,
        last_used_at,
        created_at,
        expires_at,
        admin_notes,
        users(email, full_name)
      `)
      .eq("id", licenseId)
      .single();

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    return NextResponse.json({ license });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unexpected server error" },
      { status: 500 }
    );
  }
}
