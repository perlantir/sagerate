# ProLoanMatch

ProLoanMatch is a professional mortgage rate marketplace for physicians, dentists, attorneys, veterinarians, CPAs, and other advanced-degree borrowers. It lets users compare professional mortgage programs, answer a guided rate-finder flow, and route submitted profiles to matched lending partners.

## Features

- Concept-matched homepage and rate comparison experience
- `/compare` rate table with profession, state, amount, career-stage, and down-payment filters
- `/get-rates` guided multi-step rate finder with validation, scoring, and consent capture
- `/thank-you` matched rate options summary
- Profession and state landing pages
- Admin dashboard for leads, buyers, programs, analytics, settings, and exports
- Optional Supabase/Postgres persistence with in-memory fallback for local development
- Optional integrations for reCAPTCHA, TrustedForm, Jornaya, phone/email/IP checks, Redis rate limiting, and Resend notifications

## Getting Started

Install dependencies and start the local app:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

Copy `.env.example` to `.env.local` and fill in the services you want to enable. The app runs locally without external service keys.

```bash
cp .env.example .env.local
```

## Database

The database schema lives in `lib/db/schema.ts` and is configured by `drizzle.config.ts`.

```bash
npm run db:generate
npm run db:push
```

## Mortgage Rate Scraper

The scraper stores public professional and doctor mortgage rate observations in Postgres. It starts from the configured lender programs, records every source check, and marks pages that block automation or do not publish rates.

Run one scrape:

```bash
npm run rates:scrape
```

Run with local installed Chrome through `playwright-core`:

```bash
npm run rates:scrape -- --mode=browser
```

Run the local scheduler. Keep this process open on the computer that should perform the checks; by default it runs at 10:00 and 15:00 local time.

```bash
npm run rates:scheduler
```

Useful environment variables:

- `RATE_SCRAPER_MODE=fetch_html` or `browser`
- `RATE_SCRAPER_TIMES=10:00,15:00`
- `RATE_SCRAPER_HEADLESS=false` to watch Chrome and sign into any source that requires a session
- `RATE_SCRAPER_SOURCE_OVERRIDES` as JSON to replace a seeded lender URL with the exact public program/rate page

## Validation

```bash
npm run typecheck
npm run lint
npm run build
```

## Key Routes

- `/` homepage
- `/compare` professional mortgage rate comparison
- `/get-rates` guided rate finder
- `/admin` operations dashboard
- `/professions/physicians`
- `/states/iowa`
