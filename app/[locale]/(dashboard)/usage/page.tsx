import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { UsageContent } from "./usage-content";

export default async function UsagePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: logs } = await supabase
    .from("usage_logs")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(100);

  return <UsageContent logs={logs ?? []} />;
}
