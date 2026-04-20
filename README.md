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