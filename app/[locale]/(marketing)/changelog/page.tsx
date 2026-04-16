import { GradientOrbs } from "@/components/shared/gradient-orbs";

const CHANGELOG = [
  {
    version: "1.2.0",
    date: "April 2026",
    tag: "New",
    tagColor: "emerald",
    changes: [
      "Added Competitor Analysis with keyword pool automation",
      "Mass ALT text generation now supports 1000+ images at once",
      "New Safe Mode prevents any non-SEO modifications",
      "Weekly email reports now include competitor comparisons",
    ],
  },
  {
    version: "1.1.0",
    date: "March 2026",
    tag: "Update",
    tagColor: "cyan",
    changes: [
      "Google PageSpeed integration — real Core Web Vitals data",
      "Schema.org injection supports WooCommerce products",
      "Autopilot now supports 15 article types",
      "Dashboard redesigned with usage analytics",
    ],
  },
  {
    version: "1.0.0",
    date: "February 2026",
    tag: "Launch",
    tagColor: "violet",
    changes: [
      "Initial public launch of SEOVALT",
      "AI article generation powered by Claude Sonnet",
      "Full-site SEO scanner (H1, meta, titles, slugs, alt texts)",
      "License key system with Free, Pro, Agency plans",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <div className="relative pt-24 min-h-screen">
      <GradientOrbs />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
        <div className="mb-12">
          <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full border border-border-b text-muted bg-surface-2 mb-4">
            Changelog
          </span>
          <h1 className="text-4xl font-black text-text">What&apos;s new in SEOVALT</h1>
          <p className="mt-3 text-muted">New features, improvements, and fixes.</p>
        </div>

        <div className="relative">
          <div className="absolute left-3.5 top-0 bottom-0 w-px bg-border" aria-hidden />

          <div className="space-y-12">
            {CHANGELOG.map((entry) => (
              <div key={entry.version} className="relative pl-10">
                <div
                  className={`absolute left-0 w-7 h-7 rounded-full flex items-center justify-center border-2 text-xs font-bold
                    ${entry.tagColor === "emerald" ? "border-emerald text-emerald bg-emerald-dim" :
                      entry.tagColor === "cyan" ? "border-cyan text-cyan bg-cyan-dim" :
                      "border-violet text-violet bg-violet-dim"}`}
                  style={{ top: "2px" }}
                >
                  {entry.version.split(".")[0]}
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <span className="text-lg font-bold text-text">v{entry.version}</span>
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full
                    ${entry.tagColor === "emerald" ? "bg-emerald-dim text-emerald" :
                      entry.tagColor === "cyan" ? "bg-cyan-dim text-cyan" :
                      "bg-violet-dim text-violet"}`}>
                    {entry.tag}
                  </span>
                  <span className="text-sm text-muted ml-auto">{entry.date}</span>
                </div>

                <ul className="space-y-2">
                  {entry.changes.map((change, ci) => (
                    <li key={ci} className="flex items-start gap-2 text-sm text-muted">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-border-b flex-shrink-0" />
                      {change}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
