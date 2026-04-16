"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  LayoutDashboard, Key, BarChart3, CreditCard,
  Settings, BookOpen, ChevronLeft, ChevronRight, LogOut, Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function Sidebar() {
  const t = useTranslations("dashboard.sidebar");
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  const navItems = [
    { icon: LayoutDashboard, label: t("overview"),  href: "/dashboard" },
    { icon: Key,             label: t("licenses"),  href: "/dashboard/licenses" },
    { icon: BarChart3,       label: t("usage"),     href: "/dashboard/usage" },
    { icon: CreditCard,      label: t("billing"),   href: "/dashboard/billing" },
    { icon: Settings,        label: t("settings"),  href: "/dashboard/settings" },
    { icon: BookOpen,        label: t("docs"),       href: "/docs", external: true },
  ];

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <aside
      className={cn(
        "flex-shrink-0 flex flex-col border-r border-border bg-surface transition-all duration-300",
        collapsed ? "w-16" : "w-56"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-border">
        {!collapsed ? (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-dim flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-emerald" />
            </div>
            <span className="text-sm font-black text-text">
              SEO<span className="text-emerald">VALT</span>
            </span>
          </div>
        ) : (
          <div className="w-6 h-6 rounded-md bg-emerald-dim flex items-center justify-center mx-auto">
            <Zap className="w-3.5 h-3.5 text-emerald" />
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 space-y-0.5 px-2">
        {navItems.map(({ icon: Icon, label, href, external }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              target={external ? "_blank" : undefined}
              title={collapsed ? label : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150",
                isActive
                  ? "bg-emerald-dim text-emerald font-semibold"
                  : "text-muted hover:text-text hover:bg-surface-2"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="pb-3 px-2 space-y-1 border-t border-border pt-3">
        {/* Sign out */}
        <button
          onClick={handleSignOut}
          title={collapsed ? "Sign out" : undefined}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted hover:text-text hover:bg-surface-2 transition-all"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </button>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          title={t("collapse")}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted hover:text-text hover:bg-surface-2 transition-all"
        >
          {collapsed
            ? <ChevronRight className="w-4 h-4 flex-shrink-0" />
            : <>
                <ChevronLeft className="w-4 h-4 flex-shrink-0" />
                <span>{t("collapse")}</span>
              </>
          }
        </button>
      </div>
    </aside>
  );
}
