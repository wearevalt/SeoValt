import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { BillingContent } from "./billing-content";

export default async function BillingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  return <BillingContent profile={profile} />;
}
