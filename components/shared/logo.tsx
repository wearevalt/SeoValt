"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  href?: string;
}

export function Logo({ className, size = "md", href = "/" }: LogoProps) {
  const logoHeight = size === "lg" ? 40 : size === "md" ? 32 : 24;

  const inner = (
    <span className={cn("flex items-center gap-2 group", className)}>
      <Image
        src="/seo-valt.png"
        alt="SEOVALT"
        width={logoHeight * 5}
        height={logoHeight}
        className="block"
        priority={true}
      />
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
