import "server-only";
import { createClient } from "@supabase/supabase-js";

function normalizeEnvValue(value: string | undefined): string {
  if (!value) return "";
  return value.trim().replace(/^["']|["']$/g, "");
}

export function createAdminClient() {
  const supabaseUrl = normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const serviceRoleKey = normalizeEnvValue(process.env.SUPABASE_SERVICE_ROLE_KEY);

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase admin environment variables.");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
