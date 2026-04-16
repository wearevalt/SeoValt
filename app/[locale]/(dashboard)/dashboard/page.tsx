import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { OverviewContent } from "./overview-content";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch user profile + quotas
  const [{ data: profile }, { data: quotas }] = await Promise.all([
    supabase.from("users").select("*").eq("id", user.id).single(),
    supabase
      .from("monthly_quotas")
      .select("*")
      .eq("user_id", user.id)
      .eq("month", new Date().toISOString().slice(0, 7) + "-01")
      .single(),
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
    />
  );
}
