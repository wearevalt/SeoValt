"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  LayoutDashboard,
  Key,
  BarChart3,
  CreditCard,
  Settings,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

function normalizePath(path: string): string {
  if (path.length > 1 && path.endsWith("/")) {
    return path.slice(0, -1);
  }
  return path;
}

function isActiveRoute(pathname: string, href: string): boolean {
  const normalizedPath = normalizePath(pathname);
  const normalizedHref = normalizePath(href);

  if (normalizedHref === "/dashboard") {
    return (
      normalizedPath === normalizedHref ||
      normalizedPath.endsWith(normalizedHref)
    );
  }

  return (
    normalizedPath === normalizedHref ||
    normalizedPath.endsWith(normalizedHref) ||
    normalizedPath.includes(`${normalizedHref}/`)
  );
}

export function Sidebar() {
  const t = useTranslations("dashboard.sidebar");
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  const primaryNavItems = [
    { icon: LayoutDashboard, label: t("overview"),  href: "/dashboard" },
    { icon: Key,             label: t("licenses"),  href: "/dashboard/licenses" },
    { icon: BarChart3,       label: t("usage"),     href: "/dashboard/usage" },
    { icon: CreditCard,      label: t("billing"),   href: "/dashboard/billing" },
  ];

  const secondaryNavItems = [
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
        "flex h-full flex-shrink-0 flex-col border-r border-border bg-background/35 transition-all duration-300",
        collapsed ? "w-16" : "w-52"
      )}
    >
      <div className="flex h-16 items-center border-b border-border px-4">
        {!collapsed ? (
          <div className="flex items-center gap-2.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-dim">
              <Zap className="h-3.5 w-3.5 text-emerald" />
            </div>
            <span className="text-xs font-black text-text">
              SEO<span className="text-emerald">VALT</span>
            </span>
          </div>
        ) : (
          <div className="mx-auto flex h-6 w-6 items-center justify-center rounded-md bg-emerald-dim">
            <Zap className="h-3.5 w-3.5 text-emerald" />
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-0.5 px-2 py-3">
        {primaryNavItems.map(({ icon: Icon, label, href }) => {
          const isActive = isActiveRoute(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-150",
                isActive
                  ? "border border-emerald/20 bg-emerald-dim text-emerald"
                  : "text-muted hover:bg-surface-2 hover:text-text"
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          );
        })}

        {!collapsed && (
          <div className="mx-2 my-2 border-t border-border pt-2" />
        )}

        {secondaryNavItems.map(({ icon: Icon, label, href, external }) => {
          const isActive = isActiveRoute(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              target={external ? "_blank" : undefined}
              title={collapsed ? label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-150",
                isActive
                  ? "border border-emerald/20 bg-emerald-dim text-emerald"
                  : "text-muted hover:bg-surface-2 hover:text-text"
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-border px-2 pb-3 pt-3">
        <button
          onClick={handleSignOut}
          title={collapsed ? "Sign out" : undefined}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted transition-all hover:bg-surface-2 hover:text-text"
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </button>

        <button
          onClick={() => setCollapsed((c) => !c)}
          title={t("collapse")}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted transition-all hover:bg-surface-2 hover:text-text"
        >
          {collapsed
            ? <ChevronRight className="h-4 w-4 flex-shrink-0" />
            : <>
                <ChevronLeft className="h-4 w-4 flex-shrink-0" />
                <span>{t("collapse")}</span>
              </>
          }
        </button>
      </div>
    </aside>
  );
}
