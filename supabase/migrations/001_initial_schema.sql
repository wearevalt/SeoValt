-- ─── SEOVALT Initial Schema ──────────────────────────────────────────────────
-- Run this in your Supabase SQL editor or via supabase db push

-- Enable pgcrypto for random key generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ─── USERS TABLE ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.users (
  id                     UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email                  TEXT        NOT NULL,
  full_name              TEXT,
  avatar_url             TEXT,
  plan                   TEXT        NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'agency')),
  language               TEXT        NOT NULL DEFAULT 'en'  CHECK (language IN ('en', 'fr', 'es')),
  stripe_customer_id     TEXT        UNIQUE,
  stripe_subscription_id TEXT        UNIQUE,
  subscription_status    TEXT        NOT NULL DEFAULT 'inactive'
                         CHECK (subscription_status IN ('inactive', 'active', 'past_due', 'canceled')),
  subscription_ends_at   TIMESTAMPTZ,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── LICENSES TABLE ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.licenses (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  license_key  TEXT        UNIQUE NOT NULL,
  site_url     TEXT,
  plan         TEXT        NOT NULL DEFAULT 'free',
  is_active    BOOLEAN     NOT NULL DEFAULT TRUE,
  activated_at TIMESTAMPTZ,
  last_used_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── USAGE LOGS TABLE ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.usage_logs (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  license_id   UUID        REFERENCES public.licenses(id) ON DELETE SET NULL,
  action       TEXT        NOT NULL
               CHECK (action IN ('generate_article', 'fix_seo', 'check_pagespeed',
                                 'optimize_images', 'scan_site', 'competitor_analysis')),
  credits_used INT         NOT NULL DEFAULT 1,
  metadata     JSONB,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── MONTHLY QUOTAS TABLE ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.monthly_quotas (
  id                    UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID    NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  month                 DATE    NOT NULL,   -- stored as YYYY-MM-01
  articles_generated    INT     NOT NULL DEFAULT 0,
  seo_fixes             INT     NOT NULL DEFAULT 0,
  pagespeed_checks      INT     NOT NULL DEFAULT 0,
  image_optimizations   INT     NOT NULL DEFAULT 0,
  UNIQUE (user_id, month)
);

-- ─── INDEXES ─────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_licenses_user_id        ON public.licenses(user_id);
CREATE INDEX IF NOT EXISTS idx_licenses_key            ON public.licenses(license_key);
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_id      ON public.usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_created_at   ON public.usage_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_monthly_quotas_user_month ON public.monthly_quotas(user_id, month);

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────────────────────
ALTER TABLE public.users         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.licenses      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_logs    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_quotas ENABLE ROW LEVEL SECURITY;

-- Users: can only see/update their own row
CREATE POLICY "users_select_own" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_update_own" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Licenses: own rows only
CREATE POLICY "licenses_select_own" ON public.licenses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "licenses_insert_own" ON public.licenses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "licenses_update_own" ON public.licenses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "licenses_delete_own" ON public.licenses FOR DELETE USING (auth.uid() = user_id);

-- Usage logs: own rows only
CREATE POLICY "usage_logs_select_own" ON public.usage_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "usage_logs_insert_own" ON public.usage_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Monthly quotas: own rows only
CREATE POLICY "monthly_quotas_select_own" ON public.monthly_quotas FOR SELECT USING (auth.uid() = user_id);

-- ─── FUNCTIONS ───────────────────────────────────────────────────────────────

-- Generate a license key in SVT-XXXX-XXXX-XXXX-XXXX format
CREATE OR REPLACE FUNCTION public.generate_license_key()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  chars  TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := 'SVT';
  i      INT;
  seg    TEXT;
BEGIN
  FOR _ IN 1..4 LOOP
    seg := '';
    FOR i IN 1..4 LOOP
      seg := seg || substr(chars, floor(random() * length(chars) + 1)::INT, 1);
    END LOOP;
    result := result || '-' || seg;
  END LOOP;
  RETURN result;
END;
$$;

-- Auto-generate license key on insert if not provided
CREATE OR REPLACE FUNCTION public.set_license_key()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.license_key IS NULL OR NEW.license_key = '' THEN
    LOOP
      NEW.license_key := public.generate_license_key();
      EXIT WHEN NOT EXISTS (SELECT 1 FROM public.licenses WHERE license_key = NEW.license_key);
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_set_license_key
  BEFORE INSERT ON public.licenses
  FOR EACH ROW EXECUTE FUNCTION public.set_license_key();

-- Check quota for a user/action
CREATE OR REPLACE FUNCTION public.check_quota(p_user_id UUID, p_action TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_plan     TEXT;
  v_quota    RECORD;
  v_limit    INT;
  v_used     INT;
  v_month    DATE := DATE_TRUNC('month', NOW())::DATE;
BEGIN
  SELECT plan INTO v_plan FROM public.users WHERE id = p_user_id;

  -- Get or create monthly quota
  INSERT INTO public.monthly_quotas (user_id, month)
  VALUES (p_user_id, v_month)
  ON CONFLICT (user_id, month) DO NOTHING;

  SELECT * INTO v_quota FROM public.monthly_quotas
  WHERE user_id = p_user_id AND month = v_month;

  -- Determine limit and current usage based on plan and action
  CASE p_action
    WHEN 'generate_article' THEN
      v_limit := CASE v_plan WHEN 'free' THEN 5 WHEN 'pro' THEN 50 ELSE -1 END;
      v_used  := v_quota.articles_generated;
    WHEN 'fix_seo' THEN
      v_limit := CASE v_plan WHEN 'free' THEN 10 ELSE -1 END;
      v_used  := v_quota.seo_fixes;
    WHEN 'check_pagespeed' THEN
      v_limit := CASE v_plan WHEN 'free' THEN 5 WHEN 'pro' THEN 100 ELSE -1 END;
      v_used  := v_quota.pagespeed_checks;
    ELSE
      v_limit := -1; -- unlimited for other actions
      v_used  := 0;
  END CASE;

  RETURN jsonb_build_object(
    'allowed',  v_limit = -1 OR v_used < v_limit,
    'used',     v_used,
    'limit',    v_limit,
    'plan',     v_plan
  );
END;
$$;

-- Increment usage counter
CREATE OR REPLACE FUNCTION public.increment_usage(p_user_id UUID, p_action TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_month DATE := DATE_TRUNC('month', NOW())::DATE;
BEGIN
  INSERT INTO public.monthly_quotas (user_id, month)
  VALUES (p_user_id, v_month)
  ON CONFLICT (user_id, month) DO NOTHING;

  CASE p_action
    WHEN 'generate_article' THEN
      UPDATE public.monthly_quotas SET articles_generated = articles_generated + 1
      WHERE user_id = p_user_id AND month = v_month;
    WHEN 'fix_seo' THEN
      UPDATE public.monthly_quotas SET seo_fixes = seo_fixes + 1
      WHERE user_id = p_user_id AND month = v_month;
    WHEN 'check_pagespeed' THEN
      UPDATE public.monthly_quotas SET pagespeed_checks = pagespeed_checks + 1
      WHERE user_id = p_user_id AND month = v_month;
    WHEN 'optimize_images' THEN
      UPDATE public.monthly_quotas SET image_optimizations = image_optimizations + 1
      WHERE user_id = p_user_id AND month = v_month;
    ELSE NULL;
  END CASE;
END;
$$;

-- Auto-create user row on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

CREATE TRIGGER users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
