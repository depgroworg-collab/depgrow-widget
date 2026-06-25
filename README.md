# Depgrow WhatsApp Widget SaaS

A production-ready multi-tenant SaaS that lets any business add a floating WhatsApp button to their website via a single `<script>` tag.

---

## 🏗 Architecture

```
Customer's website
  └── <script src="widget.depgrow.in/embed.js" data-widget="wgt_abc123">
        │
        ├── GET /api/config/wgt_abc123   ← Fetch widget config (cached 60s)
        └── POST /api/track/wgt_abc123   ← Log click event (country, device, referrer)

Dashboard (widget.depgrow.in/dashboard)
  ├── Create / edit / delete widgets
  ├── Copy embed code
  ├── Live preview
  └── Analytics (clicks by day, device, country)
```

---

## 📁 Folder Structure

```
depgrow-widget/
├── public/
│   └── embed.js                    ← The embed script (vanilla JS, zero deps)
├── src/
│   ├── app/
│   │   ├── layout.tsx              ← Root layout
│   │   ├── page.tsx                ← Landing page
│   │   ├── globals.css             ← All styles
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── dashboard/
│   │   │   ├── layout.tsx          ← Auth guard + sidebar
│   │   │   ├── page.tsx            ← Widget list
│   │   │   ├── analytics/page.tsx  ← Overview analytics
│   │   │   ├── settings/page.tsx
│   │   │   └── widgets/
│   │   │       ├── new/page.tsx
│   │   │       └── [id]/
│   │   │           ├── edit/page.tsx
│   │   │           └── analytics/page.tsx
│   │   └── api/
│   │       ├── config/[slug]/route.ts  ← Public: serve widget config
│   │       ├── track/[slug]/route.ts   ← Public: log click event
│   │       └── widgets/
│   │           ├── route.ts            ← GET list, POST create
│   │           └── [id]/route.ts       ← PATCH update, DELETE
│   ├── components/dashboard/
│   │   ├── Sidebar.tsx
│   │   ├── WidgetCard.tsx
│   │   ├── WidgetForm.tsx          ← Create/edit form + live preview
│   │   └── AnalyticsCharts.tsx
│   ├── lib/
│   │   ├── supabase.ts             ← Browser, server, service-role clients
│   │   ├── database.types.ts       ← Generated DB types
│   │   └── utils.ts                ← Helpers
│   └── types/index.ts              ← All TypeScript types
└── supabase/schema.sql             ← Complete DB schema
```

---

## 🚀 Setup

### 1. Clone and install

```bash
git clone https://github.com/yourrepo/depgrow-widget
cd depgrow-widget
npm install
```

### 2. Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → paste the contents of `supabase/schema.sql` → Run
3. Go to **Project Settings → API** and copy your keys

### 3. Environment variables

```bash
cp .env.local.example .env.local
# Fill in the three values:
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
# SUPABASE_SERVICE_ROLE_KEY
# NEXT_PUBLIC_APP_URL
```

### 4. Run locally

```bash
npm run dev
# Open http://localhost:3000
```

### 5. Deploy to Vercel

```bash
# Push to GitHub, then:
# vercel.com → New Project → import repo
# Add all 4 env vars in Vercel dashboard
# Deploy ✅
```

Custom domain: Vercel dashboard → Settings → Domains → Add `widget.depgrow.in`

---

## 📦 Embed Code (for customers)

After creating a widget, copy the embed code from the dashboard:

```html
<script
  src="https://widget.depgrow.in/embed.js"
  data-widget="wgt_abc123"
  async
></script>
```

Paste it before `</body>` on any website. That's it.

**Works on:** WordPress, Webflow, Wix, Shopify, plain HTML, React, Next.js — anything.

---

## 🔒 Security

| Concern              | Solution |
|----------------------|----------|
| CSS conflicts        | Inline styles only, no class names injected into the host page |
| XSS                  | `textContent` used for all user content in embed.js |
| Domain spoofing      | Per-widget domain allowlist, checked server-side |
| Auth bypass          | Supabase RLS ensures users only see their own data |
| Service role leak    | `SUPABASE_SERVICE_ROLE_KEY` is server-only, never in browser bundle |
| Click spam           | Fire-and-forget tracking; no blocker on WhatsApp open |

---

## 📊 Plan Limits

| Plan   | Widgets | Price |
|--------|---------|-------|
| Free   | 1       | ₹0    |
| Pro    | 10      | Contact Depgrow |
| Agency | ∞       | Contact Depgrow |

Plan upgrades are currently manual (email hello@depgrow.in). Stripe integration can be added as a next step.

---

## 🔮 Next Steps

- [ ] Stripe billing integration for plan upgrades
- [ ] Magic link / Google OAuth login
- [ ] A/B test different messages
- [ ] Webhook on click event (Zapier, n8n)
- [ ] White-label option (custom domain per Depgrow client)
