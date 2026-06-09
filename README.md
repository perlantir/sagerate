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
