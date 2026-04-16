import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LicensesContent } from "./licenses-content";

export default async function LicensesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: licenses }, { data: profile }] = await Promise.all([
    supabase
      .from("licenses")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase.from("users").select("plan").eq("id", user.id).single(),
  ]);

  return <LicensesContent licenses={licenses ?? []} plan={profile?.plan ?? "free"} />;
}
