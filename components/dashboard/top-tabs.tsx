"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { BarChart3, KeyRound, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

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

export function DashboardTopTabs() {
  const t = useTranslations("dashboard.sidebar");
  const pathname = usePathname();

  const tabs = [
    { href: "/dashboard", label: t("overview"), icon: LayoutDashboard },
    { href: "/dashboard/licenses", label: t("licenses"), icon: KeyRound },
    { href: "/dashboard/usage", label: t("usage"), icon: BarChart3 },
  ];

  return (
    <div className="border-b border-border bg-background/35 px-3 py-2">
      <div className="flex items-center gap-1.5">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = isActiveRoute(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-medium transition-colors",
                active
                  ? "bg-emerald-dim text-emerald"
                  : "text-muted hover:bg-surface-2 hover:text-text"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
