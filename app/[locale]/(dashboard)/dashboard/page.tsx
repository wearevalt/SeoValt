import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { OverviewContent } from "./overview-content";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: quotas }, { count: activeSiteCount }] = await Promise.all([
    supabase.from("users").select("*").eq("id", user.id).single(),
    supabase
      .from("monthly_quotas")
      .select("*")
      .eq("user_id", user.id)
      .eq("month", new Date().toISOString().slice(0, 7) + "-01")
      .single(),
    supabase
      .from("licenses")
      .select("id", { head: true, count: "exact" })
      .eq("user_id", user.id)
      .eq("is_active", true),
  ]);

  // Fetch recent activity
  const { data: activity } = await supabase
    .from("usage_logs")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <OverviewContent
      user={user}
      profile={profile}
      quotas={quotas}
      activity={activity ?? []}
      siteCount={activeSiteCount ?? 0}
    />
  );
}
