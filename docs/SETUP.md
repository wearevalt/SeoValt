# SEOVALT — Setup Guide

## Prerequisites
- Node.js 20+
- Supabase account
- Stripe account
- Vercel account
- Anthropic API key
- Google Cloud account (for PageSpeed API)

---

## 1. Clone & Install

```bash
git clone https://github.com/your-org/seovalt.git
cd seovalt
npm install
cp .env.example .env.local
```

---

## 2. Supabase Setup

### 2.1 Create Project
1. Go to [supabase.com](https://supabase.com) → New Project
2. Region: `eu-west-1` (or closest to your users)
3. Copy your **Project URL** and **anon key** into `.env.local`

### 2.2 Run Migrations
```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```
Or paste the contents of `supabase/migrations/001_initial_schema.sql` directly in **SQL Editor**.

### 2.3 Enable Google OAuth
1. Supabase Dashboard → Authentication → Providers → Google
2. Add your Google Client ID and Secret
3. Add `https://your-project.supabase.co/auth/v1/callback` to Google's authorized redirect URIs

### 2.4 Deploy Edge Functions
```bash
# Set secrets first
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
supabase secrets set GOOGLE_PAGESPEED_API_KEY=AIza...
supabase secrets set STRIPE_SECRET_KEY=sk_live_...
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...

# Deploy all functions
supabase functions deploy verify-license
supabase functions deploy generate-article
supabase functions deploy check-pagespeed
supabase functions deploy fix-seo
supabase functions deploy optimize-images
supabase functions deploy scan-site
supabase functions deploy create-checkout
supabase functions deploy stripe-webhook
```

---

## 3. Stripe Setup

### 3.1 Create Products & Prices
1. Go to [stripe.com](https://stripe.com) → Dashboard → Products
2. Create **Pro Plan**:
   - Monthly: €19/month → copy Price ID → `STRIPE_PRICE_PRO_MONTHLY`
   - Yearly: €182/year → copy Price ID → `STRIPE_PRICE_PRO_YEARLY`
3. Create **Agency Plan**:
   - Monthly: €49/month → `STRIPE_PRICE_AGENCY_MONTHLY`
   - Yearly: €470/year → `STRIPE_PRICE_AGENCY_YEARLY`

### 3.2 Configure Webhook
1. Stripe Dashboard → Developers → Webhooks → Add Endpoint
2. URL: `https://seovalt.io/api/webhooks/stripe`
3. Events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. Copy Signing Secret → `STRIPE_WEBHOOK_SECRET`

### 3.3 Customer Portal
1. Stripe Dashboard → Settings → Billing → Customer Portal
2. Enable the portal and configure allowed features
3. This is used by the "Manage Subscription" button in the dashboard

### 3.4 Local Webhook Testing
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## 4. Vercel Deployment

### 4.1 Deploy
```bash
npm install -g vercel
vercel --prod
```

Or connect your GitHub repo in the Vercel dashboard.

### 4.2 Environment Variables
In Vercel Dashboard → Project → Settings → Environment Variables, add all variables from `.env.example`.

### 4.3 Domain
1. Vercel → Project → Settings → Domains
2. Add `seovalt.io` and `www.seovalt.io`
3. Update DNS records as instructed by Vercel

---

## 5. i18n — Adding a New Language

1. Create `messages/de.json` (copy from `en.json` and translate)
2. Add `"de"` to `routing.locales` in `i18n/routing.ts`
3. Add to `alternates.languages` in `app/[locale]/layout.tsx`
4. Update `app/sitemap.ts` LOCALES array
5. Add German flag to `LanguageSwitcher` in `components/shared/language-switcher.tsx`

---

## 6. Local Development

```bash
npm run dev
# App runs at http://localhost:3000
# Redirects to http://localhost:3000/en
```
