"use client";

export function GradientOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* Top-left emerald orb */}
      <div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, #10b981 0%, transparent 70%)",
          animation: "orb-drift 18s ease-in-out infinite",
          filter: "blur(80px)",
        }}
      />
      {/* Top-right cyan orb */}
      <div
        className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full opacity-15"
        style={{
          background: "radial-gradient(circle, #0ea5e9 0%, transparent 70%)",
          animation: "orb-drift 22s ease-in-out infinite reverse",
          filter: "blur(80px)",
        }}
      />
      {/* Bottom-center violet orb */}
      <div
        className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full opacity-10"
        style={{
          background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
          animation: "orb-drift 26s ease-in-out infinite",
          filter: "blur(100px)",
        }}
      />
    </div>
  );
}

export function SubtleOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className="absolute top-1/4 -left-20 w-[400px] h-[400px] rounded-full opacity-8"
        style={{
          background: "radial-gradient(circle, #10b981 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute bottom-1/4 -right-20 w-[300px] h-[300px] rounded-full opacity-8"
        style={{
          background: "radial-gradient(circle, #0ea5e9 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
    </div>
  );
}
