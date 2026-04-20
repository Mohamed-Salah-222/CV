# Job Application Tracker

AI-powered job search companion focused on real pain points: AI hallucination, ghost jobs, scam detection, and fake take-home tasks.

## Structure

- `/client` — React + TypeScript + Vite + Tailwind + shadcn/ui
- `/server` — Node.js + Express + TypeScript + MongoDB (Mongoose)

## Prerequisites

- Node.js 20+
- MongoDB (local or Atlas)
- npm

## Setup

```bash
# Clone
git clone <repo-url>
cd <repo-name>

# Client
cd client
cp .env.example .env
npm install
npm run dev

# Server (new terminal)
cd server
cp .env.example .env
npm install
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env` in each folder and fill in values. Never commit `.env`.

## Contributing

- Branch from `main`: `feat/<short-description>` or `fix/<short-description>`
- Open a PR, request review, squash-merge after approval.

## License

No license currently. All rights reserved. A license will be added before any public release.

## Database

Postgres hosted on Supabase, managed with Prisma 7.

### First-time setup

1. Create a Supabase project at [supabase.com](https://supabase.com) and grab your connection strings (Project Settings → Database)
2. Copy `backend/.env.example` to `backend/.env`
3. Fill in `DATABASE_URL` (pooler URL, port 6543) and `DIRECT_URL` (direct URL, port 5432) in `.env`
4. From the `backend/` folder: `npm install` (this automatically generates the Prisma client via `postinstall`)
5. Run migrations to create tables: `npm run db:migrate`

### Workflow

**Making a schema change:**
1. Edit `backend/prisma/schema.prisma`
2. Run `npm run db:migrate` and give the migration a descriptive name when prompted
3. Commit the generated migration file in `prisma/migrations/`

**After pulling a branch with new migrations:**
1. Run `npm run db:migrate` to apply them locally
2. Run `npm run db:generate` if Prisma client types feel stale

**Browse the database:** `npm run db:studio` (opens a local GUI)

**Reset local database (destructive, dev only):** `npm run db:reset`

### Notes

- `DATABASE_URL` uses the Supabase connection pooler (port 6543) — for app queries
- `DIRECT_URL` uses the direct connection (port 5432) — for migrations
- Never commit `.env` files
- Never run `db:reset` against production
- Generated Prisma client at `backend/src/generated/` is gitignored and regenerated on install