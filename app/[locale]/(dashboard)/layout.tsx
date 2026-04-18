import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/dashboard/sidebar";
import { DashboardTopTabs } from "@/components/dashboard/top-tabs";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  return (
    <div className="min-h-screen bg-background p-2 sm:p-4">
      <div className="mx-auto flex h-[calc(100vh-1rem)] max-w-[1400px] flex-col overflow-hidden rounded-3xl border border-border-b bg-surface/70 shadow-[0_0_80px_rgba(16,185,129,0.08)] sm:h-[calc(100vh-2rem)]">
        <div className="flex items-center gap-2 border-b border-border bg-background/50 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald/70" />
          <span className="ml-3 text-xs font-mono text-muted">app.seovalt.io/dashboard</span>
        </div>

        <div className="flex min-h-0 flex-1">
          <Sidebar />
          <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <DashboardTopTabs />
            <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
