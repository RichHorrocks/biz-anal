# Biz Anal — Local Business Opportunity Scanner

Find local businesses with obvious revenue leaks. Ranked by how easy they are to sell to and what service you should pitch.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI | Tailwind CSS + shadcn/ui |
| API | tRPC v11 |
| ORM | Drizzle ORM |
| Database | Neon (Postgres) |
| Cache | Upstash Redis |
| Auth | Clerk |
| Business data | Google Places API (New) |
| Website analysis | Google PageSpeed Insights + Cheerio |
| AI pitches | Anthropic Claude (claude-sonnet-4-6) |
| Deployment | Vercel |

---

## Prerequisites

- Node.js 20+
- npm
- A [Clerk](https://dashboard.clerk.com) account
- A [Neon](https://neon.tech) account (or via Vercel Marketplace)
- An [Upstash](https://console.upstash.com) account (or via Vercel Marketplace)
- A [Google Cloud](https://console.cloud.google.com) project with **Places API (New)** enabled
- An [Anthropic](https://console.anthropic.com) API key

---

## Local setup

### 1. Clone and install

```bash
git clone https://github.com/RichHorrocks/biz-anal.git
cd biz-anal
npm install
```

### 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Open `.env.local` and fill in every value. See below for where to find each key.

**Clerk**
1. Go to [dashboard.clerk.com](https://dashboard.clerk.com) → Create application
2. Copy **Publishable key** → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
3. Copy **Secret key** → `CLERK_SECRET_KEY`

**Neon**
1. Go to [neon.tech](https://neon.tech) → Create project → Create database
2. Copy the **Connection string** → `DATABASE_URL`

**Upstash Redis**
1. Go to [console.upstash.com](https://console.upstash.com) → Create database (Redis)
2. Copy **REST URL** → `UPSTASH_REDIS_REST_URL`
3. Copy **REST Token** → `UPSTASH_REDIS_REST_TOKEN`

**Google Places**
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Enable **Places API (New)** for your project
3. Create an API key → `GOOGLE_PLACES_API_KEY`

**Anthropic**
1. Go to [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys)
2. Create an API key → `ANTHROPIC_API_KEY`

### 3. Push the database schema

```bash
npm run db:push
```

This creates all tables in your Neon database. You can inspect them visually with:

```bash
npm run db:studio
```

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You'll be prompted to sign in via Clerk, then land on the dashboard.

---

## Available scripts

| Script | Description |
|---|---|
| `npm run dev` | Start local dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push schema to database (skips migration files) |
| `npm run db:generate` | Generate migration SQL files |
| `npm run db:migrate` | Run pending migrations |
| `npm run db:studio` | Open Drizzle Studio (DB GUI) |

---

## Project structure

```
.
├── app/                    # Next.js App Router pages
│   ├── api/trpc/[trpc]/    # tRPC catch-all handler
│   ├── dashboard/          # Protected dashboard (M2+)
│   ├── sign-in/            # Clerk sign-in page
│   └── sign-up/            # Clerk sign-up page
├── components/
│   ├── providers/          # TRPCProvider (React Query + tRPC client)
│   └── ui/                 # shadcn/ui components
├── db/
│   ├── index.ts            # Drizzle + Neon client
│   └── schema.ts           # Full database schema
├── lib/
│   ├── cache.ts            # Upstash Redis getOrSet helper
│   └── trpc/               # tRPC browser client + server caller
├── server/
│   ├── trpc.ts             # tRPC init, context, procedures
│   ├── root.ts             # Root app router
│   └── routers/            # Per-feature routers (added each milestone)
├── proxy.ts                # Clerk auth proxy (Next.js 16)
├── drizzle.config.ts
└── .env.local.example      # All required env vars with comments
```

---

## Milestones

| # | Milestone | Status |
|---|---|---|
| M1 | Foundation — scaffold, auth, DB, cache | ✅ Complete |
| M2 | Search & Enrichment — Google Places | 🔜 Next |
| M3 | Signal Detection — website, reviews, GBP | 🔜 |
| M4 | Opportunity Scoring | 🔜 |
| M5 | UI | 🔜 |
| M6 | Export & Outreach | 🔜 |

Track progress on the [GitHub Project Board](https://github.com/users/RichHorrocks/projects/3).
