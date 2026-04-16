"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  href?: string;
}

export function Logo({ className, size = "md", href = "/" }: LogoProps) {
  const sizes = {
    sm: { text: "text-lg", dot: "w-2 h-2", bar: "w-1 h-4" },
    md: { text: "text-xl", dot: "w-2.5 h-2.5", bar: "w-1.5 h-5" },
    lg: { text: "text-2xl", dot: "w-3 h-3", bar: "w-2 h-6" },
  };

  const s = sizes[size];

  const inner = (
    <span className={cn("flex items-center gap-2 group", className)}>
      {/* Icon mark */}
      <span className="relative flex items-end gap-0.5" aria-hidden>
        {[3, 5, 4, 6].map((h, i) => (
          <span
            key={i}
            className={cn(
              s.bar,
              "rounded-full bg-emerald transition-all duration-300",
              "group-hover:bg-emerald-br"
            )}
            style={{
              height: `${h * (size === "lg" ? 4 : size === "md" ? 3.5 : 3)}px`,
              boxShadow: "0 0 6px #10b98160",
            }}
          />
        ))}
        <span
          className={cn(
            s.dot,
            "rounded-full bg-emerald absolute -top-0.5 -right-1",
            "group-hover:bg-emerald-br transition-colors"
          )}
          style={{ boxShadow: "0 0 8px #10b981" }}
        />
      </span>

      {/* Wordmark */}
      <span
        className={cn(
          s.text,
          "font-black tracking-tight text-text",
          "group-hover:text-white transition-colors"
        )}
      >
        SEO
        <span
          className="text-emerald"
          style={{ textShadow: "0 0 20px #10b98160" }}
        >
          VALT
        </span>
      </span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="outline-none focus-visible:ring-2 focus-visible:ring-emerald rounded-sm">
        {inner}
      </Link>
    );
  }

  return inner;
}
