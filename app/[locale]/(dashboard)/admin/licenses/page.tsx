import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/auth/admin";
import { AdminLicensesContent, type AdminLicense } from "./admin-licenses-content";

type SearchValue = string | string[] | undefined;

function pickValue(value: SearchValue): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function normalizeText(value: string): string {
  return value.trim().toLowerCase();
}

function getUserMeta(usersField: unknown): { userEmail: string; userName: string } {
  const raw = Array.isArray(usersField) ? usersField[0] : usersField;
  const user = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};

  return {
    userEmail: typeof user.email === "string" ? user.email : "",
    userName: typeof user.full_name === "string" ? user.full_name : "",
  };
}

export default async function AdminLicensesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: SearchValue }>;
}) {
  const { locale } = await params;
  const search = await searchParams;

  const q = pickValue(search.q).trim();
  const status = pickValue(search.status);
  const plan = pickValue(search.plan);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  if (!isAdminEmail(user.email)) {
    redirect(`/${locale}/dashboard`);
  }

  let serverError = "";
  let licenses: AdminLicense[] = [];

  try {
    const admin = createAdminClient();
    let query = admin
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
      .order("created_at", { ascending: false })
      .limit(500);

    if (status === "active") query = query.eq("is_active", true);
    if (status === "inactive") query = query.eq("is_active", false);
    if (plan === "free" || plan === "pro" || plan === "agency") {
      query = query.eq("plan", plan);
    }

    const { data, error } = await query;
    if (error) {
      throw new Error(error.message);
    }

    licenses = (data ?? []).map((row) => {
      const base = row as Record<string, unknown>;
      const { userEmail, userName } = getUserMeta(base.users);
      return {
        id: String(base.id ?? ""),
        userId: String(base.user_id ?? ""),
        licenseKey: String(base.license_key ?? ""),
        siteUrl: typeof base.site_url === "string" ? base.site_url : null,
        plan: String(base.plan ?? "free"),
        isActive: Boolean(base.is_active),
        activatedAt: typeof base.activated_at === "string" ? base.activated_at : null,
        lastUsedAt: typeof base.last_used_at === "string" ? base.last_used_at : null,
        createdAt: String(base.created_at ?? ""),
        expiresAt: typeof base.expires_at === "string" ? base.expires_at : null,
        adminNotes: typeof base.admin_notes === "string" ? base.admin_notes : "",
        userEmail,
        userName,
      };
    });
  } catch (err: unknown) {
    serverError =
      err instanceof Error
        ? err.message
        : "Failed to load admin licenses data";
  }

  if (!serverError && q) {
    const needle = normalizeText(q);
    licenses = licenses.filter((license) => {
      return (
        normalizeText(license.licenseKey).includes(needle) ||
        normalizeText(license.siteUrl ?? "").includes(needle) ||
        normalizeText(license.userEmail).includes(needle) ||
        normalizeText(license.userName).includes(needle)
      );
    });
  }

  return (
    <AdminLicensesContent
      initialLicenses={licenses}
      initialFilters={{ q, status, plan }}
      adminEmail={user.email ?? ""}
      serverError={serverError}
    />
  );
}
