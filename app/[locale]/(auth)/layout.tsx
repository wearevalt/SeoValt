import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { GradientOrbs } from "@/components/shared/gradient-orbs";
import { AnimatedBeams } from "@/components/shared/beams";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4 py-16">
      <GradientOrbs />
      <AnimatedBeams count={3} />

      {/* Grid bg */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(var(--border-b) 1px, transparent 1px), linear-gradient(90deg, var(--border-b) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
        aria-hidden
      />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo size="lg" href="/" />
        </div>

        {children}

        <p className="mt-6 text-center text-xs text-muted">
          Protected by SEOVALT security.{" "}
          <Link href="/legal/privacy" className="underline hover:text-text transition-colors">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
