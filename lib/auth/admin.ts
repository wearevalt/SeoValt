const DEFAULT_ADMIN_EMAILS = ["wearevalt@gmail.com", "support@wearevalt.co"];

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS;
  if (!raw) return DEFAULT_ADMIN_EMAILS;

  const list = raw
    .split(",")
    .map((entry) => normalizeEmail(entry))
    .filter(Boolean);

  return list.length > 0 ? list : DEFAULT_ADMIN_EMAILS;
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return getAdminEmails().includes(normalizeEmail(email));
}
