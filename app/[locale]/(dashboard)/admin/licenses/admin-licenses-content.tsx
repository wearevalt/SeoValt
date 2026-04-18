"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Loader2,
  RefreshCw,
  ShieldCheck,
  ShieldX,
  Save,
  Search,
  XCircle,
  CalendarClock,
} from "lucide-react";

export interface AdminLicense {
  id: string;
  userId: string;
  licenseKey: string;
  siteUrl: string | null;
  plan: string;
  isActive: boolean;
  activatedAt: string | null;
  lastUsedAt: string | null;
  createdAt: string;
  expiresAt: string | null;
  adminNotes: string;
  userEmail: string;
  userName: string;
}

type ActionPayload =
  | { action: "toggle_active"; isActive: boolean }
  | { action: "reset_domain" }
  | { action: "update_notes"; notes: string }
  | { action: "update_expiry"; expiresAt: string | null };

function toDateInputValue(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function formatDate(value: string | null): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
}

function maskLicenseKey(key: string): string {
  if (key.length < 18) return key;
  return `${key.slice(0, 8)}-****-****-${key.slice(-4)}`;
}

export function AdminLicensesContent({
  initialLicenses,
  initialFilters,
  adminEmail,
  serverError,
}: {
  initialLicenses: AdminLicense[];
  initialFilters: { q: string; status: string; plan: string };
  adminEmail: string;
  serverError?: string;
}) {
  const [licenses, setLicenses] = useState<AdminLicense[]>(initialLicenses);
  const [savingMap, setSavingMap] = useState<Record<string, boolean>>({});
  const [notesDraft, setNotesDraft] = useState<Record<string, string>>(() =>
    Object.fromEntries(initialLicenses.map((item) => [item.id, item.adminNotes ?? ""]))
  );
  const [expiryDraft, setExpiryDraft] = useState<Record<string, string>>(() =>
    Object.fromEntries(initialLicenses.map((item) => [item.id, toDateInputValue(item.expiresAt)]))
  );

  const counts = useMemo(() => {
    const active = licenses.filter((item) => item.isActive).length;
    const inactive = licenses.length - active;
    return { total: licenses.length, active, inactive };
  }, [licenses]);

  const updateLocalLicense = (updated: Partial<AdminLicense> & { id: string }) => {
    setLicenses((prev) =>
      prev.map((item) => (item.id === updated.id ? { ...item, ...updated } : item))
    );
  };

  const runAction = async (licenseId: string, payload: ActionPayload) => {
    setSavingMap((prev) => ({ ...prev, [licenseId]: true }));
    try {
      const res = await fetch(`/api/admin/licenses/${licenseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = (await res.json()) as { error?: string; license?: Record<string, unknown> };
      if (!res.ok) {
        throw new Error(json.error ?? "Update failed");
      }

      const license = json.license;
      if (!license) throw new Error("Missing updated license data");

      const normalized: AdminLicense = {
        id: String(license.id ?? ""),
        userId: String(license.user_id ?? ""),
        licenseKey: String(license.license_key ?? ""),
        siteUrl: typeof license.site_url === "string" ? license.site_url : null,
        plan: String(license.plan ?? "free"),
        isActive: Boolean(license.is_active),
        activatedAt: typeof license.activated_at === "string" ? license.activated_at : null,
        lastUsedAt: typeof license.last_used_at === "string" ? license.last_used_at : null,
        createdAt: String(license.created_at ?? ""),
        expiresAt: typeof license.expires_at === "string" ? license.expires_at : null,
        adminNotes: typeof license.admin_notes === "string" ? license.admin_notes : "",
        userEmail: (() => {
          const raw = Array.isArray(license.users) ? license.users[0] : license.users;
          return raw && typeof raw === "object" && typeof (raw as Record<string, unknown>).email === "string"
            ? ((raw as Record<string, unknown>).email as string)
            : "";
        })(),
        userName: (() => {
          const raw = Array.isArray(license.users) ? license.users[0] : license.users;
          return raw && typeof raw === "object" && typeof (raw as Record<string, unknown>).full_name === "string"
            ? ((raw as Record<string, unknown>).full_name as string)
            : "";
        })(),
      };

      updateLocalLicense(normalized);
      setNotesDraft((prev) => ({ ...prev, [licenseId]: normalized.adminNotes ?? "" }));
      setExpiryDraft((prev) => ({
        ...prev,
        [licenseId]: toDateInputValue(normalized.expiresAt),
      }));
      toast.success("License updated");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSavingMap((prev) => ({ ...prev, [licenseId]: false }));
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl p-4 sm:p-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-subtle">Admin</p>
          <h1 className="mt-1 text-2xl font-black text-text sm:text-3xl">License Control Center</h1>
          <p className="mt-1 text-sm text-muted">
            Signed in as <span className="font-medium text-text">{adminEmail}</span>
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <StatBox label="Total" value={counts.total} />
          <StatBox label="Active" value={counts.active} accent="text-emerald" />
          <StatBox label="Inactive" value={counts.inactive} accent="text-violet" />
        </div>
      </div>

      <form className="mb-4 grid gap-2 rounded-xl border border-border bg-surface p-3 sm:grid-cols-[1fr_auto_auto_auto]">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            name="q"
            defaultValue={initialFilters.q}
            placeholder="Search license, domain, email, client..."
            className="w-full rounded-lg border border-border bg-surface-2 py-2 pl-9 pr-3 text-sm text-text outline-none transition-colors focus:border-border-b"
          />
        </label>

        <select
          name="status"
          defaultValue={initialFilters.status}
          className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text outline-none focus:border-border-b"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <select
          name="plan"
          defaultValue={initialFilters.plan}
          className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text outline-none focus:border-border-b"
        >
          <option value="">All plans</option>
          <option value="free">Free</option>
          <option value="pro">Pro</option>
          <option value="agency">Agency</option>
        </select>

        <button
          type="submit"
          className="rounded-lg bg-emerald px-4 py-2 text-sm font-semibold text-background hover:bg-emerald-br"
        >
          Apply
        </button>
      </form>

      <div className="space-y-3">
        {serverError && (
          <div className="rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200">
            Failed to load admin data: {serverError}
          </div>
        )}
        {licenses.length === 0 && (
          <div className="rounded-xl border border-border bg-surface p-6 text-sm text-muted">
            No licenses found for these filters.
          </div>
        )}

        {licenses.map((license) => {
          const saving = Boolean(savingMap[license.id]);
          const hasExpired =
            Boolean(license.expiresAt) &&
            new Date(license.expiresAt as string).getTime() < Date.now();

          return (
            <div key={license.id} className="rounded-xl border border-border bg-surface p-4">
              <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-[260px]">
                  <p className="font-mono text-sm text-text" title={license.licenseKey}>
                    {maskLicenseKey(license.licenseKey)}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {license.userName || "No name"} · {license.userEmail || "No email"}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    Domain: {license.siteUrl ?? "Unbound"} · Plan:{" "}
                    <span className="uppercase">{license.plan}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full border px-2 py-0.5 text-xs",
                      license.isActive
                        ? "border-emerald/20 bg-emerald-dim text-emerald"
                        : "border-violet/30 bg-violet-dim text-violet"
                    )}
                  >
                    {license.isActive ? "Active" : "Inactive"}
                  </span>
                  {license.expiresAt && (
                    <span
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-xs",
                        hasExpired
                          ? "border-red-400/30 bg-red-500/10 text-red-300"
                          : "border-cyan/30 bg-cyan-dim text-cyan"
                      )}
                    >
                      {hasExpired ? "Expired" : "Expiry set"}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid gap-3 lg:grid-cols-[1fr_240px]">
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-subtle">Admin notes</label>
                  <textarea
                    value={notesDraft[license.id] ?? ""}
                    onChange={(e) =>
                      setNotesDraft((prev) => ({ ...prev, [license.id]: e.target.value }))
                    }
                    rows={3}
                    className="w-full resize-y rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text outline-none focus:border-border-b"
                    placeholder="Internal notes for this license..."
                  />

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() =>
                        runAction(license.id, {
                          action: "toggle_active",
                          isActive: !license.isActive,
                        })
                      }
                      disabled={saving}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-colors",
                        license.isActive
                          ? "bg-violet-dim text-violet hover:bg-violet/30"
                          : "bg-emerald-dim text-emerald hover:bg-emerald/25",
                        saving && "cursor-not-allowed opacity-70"
                      )}
                    >
                      {license.isActive ? <ShieldX className="h-3.5 w-3.5" /> : <ShieldCheck className="h-3.5 w-3.5" />}
                      {license.isActive ? "Suspend" : "Reactivate"}
                    </button>

                    <button
                      onClick={() => runAction(license.id, { action: "reset_domain" })}
                      disabled={saving || !license.siteUrl}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-muted transition-colors hover:bg-surface-2 hover:text-text",
                        (saving || !license.siteUrl) && "cursor-not-allowed opacity-60"
                      )}
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Reset domain
                    </button>

                    <button
                      onClick={() =>
                        runAction(license.id, {
                          action: "update_notes",
                          notes: notesDraft[license.id] ?? "",
                        })
                      }
                      disabled={saving}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-text transition-colors hover:bg-surface-2",
                        saving && "cursor-not-allowed opacity-60"
                      )}
                    >
                      <Save className="h-3.5 w-3.5" />
                      Save notes
                    </button>
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-surface-2 p-3">
                  <p className="mb-2 text-xs font-medium text-subtle">Expiration</p>
                  <label className="mb-2 block">
                    <span className="mb-1 inline-flex items-center gap-1 text-xs text-muted">
                      <CalendarClock className="h-3.5 w-3.5" />
                      Expiry date
                    </span>
                    <input
                      type="date"
                      value={expiryDraft[license.id] ?? ""}
                      onChange={(e) =>
                        setExpiryDraft((prev) => ({ ...prev, [license.id]: e.target.value }))
                      }
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text outline-none focus:border-border-b"
                    />
                  </label>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        runAction(license.id, {
                          action: "update_expiry",
                          expiresAt: expiryDraft[license.id] || null,
                        })
                      }
                      disabled={saving}
                      className={cn(
                        "flex-1 rounded-lg bg-cyan px-3 py-2 text-xs font-semibold text-background transition-colors hover:brightness-110",
                        saving && "cursor-not-allowed opacity-60"
                      )}
                    >
                      Save expiry
                    </button>
                    <button
                      onClick={() => runAction(license.id, { action: "update_expiry", expiresAt: null })}
                      disabled={saving}
                      className={cn(
                        "rounded-lg border border-border px-3 py-2 text-xs font-semibold text-muted transition-colors hover:bg-surface hover:text-text",
                        saving && "cursor-not-allowed opacity-60"
                      )}
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="mt-2 text-[11px] text-muted">
                    Created: {formatDate(license.createdAt)}
                  </p>
                  <p className="text-[11px] text-muted">
                    Last used: {formatDate(license.lastUsedAt)}
                  </p>
                  <p className="text-[11px] text-muted">
                    Activated: {formatDate(license.activatedAt)}
                  </p>
                </div>
              </div>

              {saving && (
                <div className="mt-3 inline-flex items-center gap-1 text-xs text-muted">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Saving changes...
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatBox({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2">
      <p className="text-xs text-muted">{label}</p>
      <p className={cn("text-lg font-black text-text", accent)}>{value}</p>
    </div>
  );
}
