-- Add admin-level license management fields
ALTER TABLE public.licenses
  ADD COLUMN IF NOT EXISTS admin_notes TEXT,
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_licenses_expires_at
  ON public.licenses(expires_at);
