# Job Application Tracker — Project Tickets

**Stack:** MERN + TypeScript, PostgreSQL (instead of MongoDB), Socket.io if needed for realtime
**Team:** 2 devs — You (Full-stack, owns all Frontend) + Friend (Backend only)

---

## Legend

- **[FE]** = Frontend (you only)
- **[BE]** = Backend (friend)
- **[SHARED]** = Both discuss/align, one implements
- **Difficulty:** 1–10 scale
- **Priority:** P0 (blocker) → P3 (nice-to-have)

---

# PHASE 0 — PROJECT SETUP

### T-001 [SHARED] Repository & Monorepo Structure — P0 — 2/10
Set up GitHub repo with `/client` (React + TS + Vite) and `/server` (Express + TS) folders. Root-level README, `.gitignore`, LICENSE.
- Decide: monorepo (one repo, two folders) vs two repos. Recommend monorepo.
- Add branch protection on `main`, require PR reviews.
- Set up `.env.example` files for both.

### T-002 [SHARED] Tech Stack Lock-in & ADR — P0 — 1/10
Write an Architecture Decision Record doc listing every major choice (Postgres, Prisma/Drizzle, auth lib, deployment targets, AI providers). One page, committed to repo.
- Prevents mid-project "should we switch to X" debates.

### T-003 [BE] Database Setup — Postgres + ORM — P0 — 3/10
Provision Postgres (Neon or Supabase free tier). Set up Prisma or Drizzle ORM with migrations. Create initial empty schema.
- Connection string in `.env`.
- Migration workflow documented in README.

### T-004 [BE] Express + TypeScript Server Skeleton — P0 — 3/10
Bootstrap Express server with TS, error middleware, request logging, CORS, health check endpoint `/api/health`.
- Folder structure: `/routes`, `/controllers`, `/services`, `/middleware`, `/db`.

### T-005 [FE] React + TypeScript + Vite Skeleton — P0 — 3/10
Bootstrap Vite + React + TS. Add Tailwind CSS, set up routing (React Router), set up a component library (shadcn/ui recommended).
- Dark mode toggle.
- Basic layout: sidebar + main content.

### T-006 [SHARED] API Contract Document — P0 — 3/10
Create `/docs/api.md` listing every planned endpoint with method, path, request/response shape. Update as features ship.
- Prevents FE/BE integration hell.
- Consider using Zod schemas shared between client and server for type safety.

### T-007 [SHARED] CI/CD Pipeline — P1 — 4/10
GitHub Actions: lint + typecheck + test on every PR. Auto-deploy `main` to staging.
- Deploy targets: Vercel (frontend) + Render/Railway/Fly.io (backend).

### T-008 [SHARED] Shared Types Package — P1 — 3/10
Small shared package or folder for types used by both client and server (User, Application, CV, etc.).

---

# PHASE 1 — MVP

## Feature: Authentication

### T-101 [BE] Auth System — Email/Password + JWT — P0 — 5/10
Implement signup, login, logout, password reset. Use bcrypt for hashing, JWT for sessions (or session cookies — discuss).
- Recommend using a library: Lucia Auth, Auth.js, or Clerk (Clerk is fastest but costs money at scale).
- Rate limit auth endpoints.

### T-102 [BE] Google OAuth — P1 — 4/10
Add "Sign in with Google" option. Important later for Gmail integration anyway.

### T-103 [FE] Auth UI — Signup / Login / Reset — P0 — 4/10
Build forms, handle errors, persist session, redirect logic. Protected route wrapper.

### T-104 [FE] User Profile Page — P1 — 3/10
Basic profile: name, email, password change, avatar upload (optional), delete account.

---

## Feature: Application Tracker (The Core)

### T-111 [BE] DB Schema — Applications — P0 — 4/10
Tables: `users`, `applications`, `application_status_history`, `application_notes`, `companies`.
- Fields: company, role, status (enum: wishlist/applied/interviewing/offer/rejected/ghosted), applied_date, source, salary range, location, URL, notes.
- Index on user_id + status.

### T-112 [BE] CRUD Endpoints — Applications — P0 — 4/10
REST endpoints: list (with filters), create, read, update, delete, status change.
- Pagination on list endpoint.
- Filters: status, company, date range, source.

### T-113 [FE] Kanban Board View — P0 — 7/10
Drag-and-drop Kanban with columns per status. Use `dnd-kit` (modern, accessible).
- Optimistic updates on drag.
- Cards show: company, role, date, quick actions.

### T-114 [FE] Application Detail Page — P0 — 5/10
Full view of an application: all fields editable, notes, status history timeline, linked CV/cover letter.

### T-115 [FE] Application List / Table View — P0 — 4/10
Alternative to Kanban — sortable table with filters. Users pick their preferred view.

### T-116 [BE] Analytics Endpoints — P1 — 5/10
Aggregate queries: response rate, average time to response, status breakdown, applications per week.
- Good SQL showcase — use window functions, GROUP BY, CTEs.

### T-117 [FE] Dashboard with Analytics — P1 — 5/10
Charts (use Recharts): applications over time, funnel conversion, response rate, by source.

### T-118 [BE] Follow-up Reminder System — P1 — 6/10
Background job (use BullMQ or just a cron) that checks applications older than N days without status change and flags them.
- Email notifications (SendGrid/Resend free tier).
- In-app notifications.

### T-119 [FE] Notifications UI — P1 — 4/10
Bell icon, dropdown with unread notifications, mark as read.

---

## Feature: CV Builder

### T-121 [BE] DB Schema — CVs — P0 — 3/10
Tables: `cvs`, `cv_sections` (experience, education, skills, projects), `cv_versions`.
- Support multiple CVs per user.

### T-122 [BE] CRUD Endpoints — CVs — P0 — 4/10
Create, update, delete CV. Auto-save on change. Version history (keep last 10 versions).

### T-123 [FE] CV Builder UI — P0 — 8/10
**Big ticket.** Multi-section form: personal info, summary, experience (repeatable), education, skills, projects.
- Live preview panel on the right.
- Section reordering (drag-and-drop).
- Auto-save with debounce.

### T-124 [FE] CV Template Renderer — P0 — 6/10
Renders the CV data into a polished visual template. Start with 2-3 templates (classic, modern, minimal).
- Must be printable and PDF-exportable.
- Use clean semantic HTML for ATS parsing.

### T-125 [BE] PDF Export Endpoint — P0 — 5/10
Server-side PDF generation (Puppeteer or react-pdf). Returns downloadable PDF.

### T-126 [BE] AI Rewrite Endpoint — P0 — 5/10
Endpoint takes a user-written bullet point + context, returns improved version. **Strict prompt: only rewrite using facts user provided. No invention.**
- Use cheap fast model (Haiku, gpt-4o-mini).
- Return multiple variants for user to pick from.

### T-127 [FE] AI Rewrite UI — P0 — 4/10
"Improve with AI" button next to each bullet/section. Shows 2-3 variants, user picks or keeps original.

### T-128 [BE] Ghost-Text Autocomplete Endpoint — P0 — 6/10
Streaming endpoint that takes current text + context, returns a completion suggestion. Low latency is critical.
- Debounce on frontend (500ms after stop typing).
- Cache common completions.
- Short max_tokens (20-30).

### T-129 [FE] Ghost-Text Autocomplete UI — P0 — 7/10
Inline muted text suggestion, Tab to accept, Esc to dismiss. Works in textareas and contenteditable.
- This is the differentiator — spend time making it feel smooth.

---

## Feature: Job Tailoring + ATS Check

### T-131 [BE] Job Post Parser — P0 — 5/10
Endpoint accepts job URL or pasted text, extracts: title, company, requirements, keywords, skills. Use LLM for structured extraction (function calling).

### T-132 [BE] ATS Compatibility Check — P0 — 6/10
Analyze CV against job post: keyword match %, missing keywords, formatting warnings (tables/images), standard sections present.
- Return honest "compatibility score" not fake "ATS score".

### T-133 [BE] CV Tailoring Endpoint — P0 — 5/10
Given user's CV + job post, suggest which bullets to emphasize, which skills to add (if user has them), reordering suggestions.
- Never invents experience user doesn't have.

### T-134 [FE] Tailoring UI — P0 — 6/10
Side-by-side: CV on left, job post on right, suggestions in middle. Accept/reject each suggestion. Save as new CV version.

### T-135 [FE] ATS Score Display — P0 — 3/10
Visual score + checklist of passes/fails + keyword gap analysis.

---

## Feature: Cover Letter & Follow-up Generation

### T-141 [BE] DB Schema — Cover Letters & Email Templates — P0 — 2/10
Tables: `cover_letters`, `email_templates`. Link to application.

### T-142 [BE] Cover Letter Generation Endpoint — P0 — 3/10
User's CV + job post → tailored cover letter. Editable after generation.

### T-143 [FE] Cover Letter Editor — P0 — 4/10
Rich text editor (TipTap recommended), generate button, regenerate section, export PDF.

### T-144 [BE] Follow-up Email Generator — P0 — 3/10
Given application context + days since applied, generate follow-up draft.

### T-145 [FE] Follow-up UI — P0 — 3/10
On application detail page: "Draft follow-up" button. Copy to clipboard or open in mail client.

---

## Feature: Ghost Job / Scam Detection

### T-151 [BE] Job Post Analysis Service — P0 — 7/10
Takes job posting data, runs heuristics + LLM analysis:
- Posting age, repost frequency (needs external data or user reports over time)
- Vagueness score (LLM)
- Specificity of requirements
- Salary disclosed?
- Company has real careers page with this listing?
- Red-flag phrase detection ("rockstar", "family", "unpaid trial")
Returns ghost job probability + reasons list.

### T-152 [BE] Scam Site Blocklist — P0 — 3/10
Maintained list of known scam job boards. Simple domain check.
- Seed list from Reddit scam reports + ScamAdviser.
- Admin endpoint to add new domains.

### T-153 [BE] Take-home Task Scam Detector — P1 — 6/10
User pastes take-home task description. LLM analyzes:
- Scope (estimated hours)
- Specificity to company's actual product
- IP assignment requirements
- Evaluation criteria clarity
Returns scam likelihood + reasoning.

### T-154 [FE] Scam Detection UI — P0 — 4/10
When adding application: automatic checks run, show flags if any. Dedicated "Check this task" tool in sidebar.

---

## Feature: Landing Page & Public Site

### T-161 [FE] Landing Page — P1 — 5/10
Marketing page: hero, features, demo video/GIF, pricing (free for now), signup CTA.
- This is your public face — spend real effort here.

### T-162 [FE] Legal Pages — P1 — 2/10
Privacy policy, terms of service. Use a generator, have a human skim them.

---

## MVP Polish & Launch Tickets

### T-171 [SHARED] E2E Testing — P1 — 6/10
Playwright tests covering critical flows: signup → create CV → create application → generate cover letter.

### T-172 [SHARED] Error Monitoring — P1 — 3/10
Sentry free tier on both client and server.

### T-173 [SHARED] Analytics — P1 — 2/10
Plausible or PostHog free tier. Track feature usage.

### T-174 [SHARED] Rate Limiting on AI Endpoints — P0 — 4/10
**Critical before public launch.** Per-user daily caps on AI calls. Redis-based.

### T-175 [SHARED] Deployment & Custom Domain — P0 — 4/10
Deploy to production URL, custom domain, SSL, DNS, monitoring.

### T-176 [SHARED] README + Architecture Diagram — P0 — 3/10
**This is what recruiters actually look at.** Clear README with screenshots, architecture diagram, tech stack, "what I learned" section.

---

# PHASE 2 — POST-MVP FEATURES

## Company Intelligence

### T-201 [BE] Company Data Service — 5/10
Integrate Crunchbase / Clearbit / manual scraping for funding, size, founded date, industry. Cache aggressively.

### T-202 [BE] Glassdoor / Review Aggregation — 6/10
Pull review summaries (unofficial API or scrape — legal gray zone). LLM summarizes sentiment.

### T-203 [BE] Company News Feed — 4/10
NewsAPI integration. Recent news about company. Flag layoffs, funding, acquisitions.

### T-204 [FE] Company Profile Page — 5/10
Dedicated page per company: overview, news, reviews, all user's applications there, salary data.

## Gmail Integration

### T-211 [BE] Gmail OAuth & API Setup — 5/10
Google Cloud project, OAuth consent screen, Gmail scopes. Token refresh handling.

### T-212 [BE] Send Email via Gmail — 5/10
Send follow-ups and networking messages from user's own Gmail.

### T-213 [BE] Email Inbox Scanning — 7/10
**Permission-heavy.** With user consent, scan inbox for application-related emails, auto-update application status (replied, rejected, interview scheduled).
- Privacy-sensitive. Clear opt-in, clear data handling.

### T-214 [FE] Email Integration UI — 5/10
Connect/disconnect Gmail, preview before send, inbox scan settings.

## Interview Prep

### T-221 [BE] Interview Question Generator — 5/10
Given job post + CV, generate likely interview questions (behavioral, technical, role-specific).

### T-222 [FE] Interview Prep UI — 6/10
Question list, user types/records answer, AI gives feedback. Optional: voice input with Web Speech API.

### T-223 [BE] Answer Evaluation — 6/10
LLM evaluates user's practice answer for clarity, STAR structure, specificity.

## Salary Intelligence

### T-231 [BE] Salary Data Aggregation — 7/10
Scrape/integrate Levels.fyi, Glassdoor, Payscale. Cache and update periodically.
- Legal gray zone on scraping. Consider using BLS data + user submissions instead.

### T-232 [FE] Salary Insights UI — 4/10
Show range for role+location+experience. Negotiation tips.

## Rejection Analysis

### T-241 [BE] Pattern Detection — 7/10
Across user's rejections, find patterns: industries, company sizes, seniority mismatches, timing. LLM-assisted summary.

### T-242 [FE] Insights Dashboard — 4/10
"What we noticed about your applications" — actionable insights.

## Browser Extension

### T-251 [SHARED] Extension Architecture — 5/10
Manifest V3 Chrome extension. Auth bridge to main app.

### T-252 [FE] One-Click Save Job — 7/10
Extension detects job postings on LinkedIn, Indeed, etc. One click → saved to tracker with parsed fields.

### T-253 [FE] LinkedIn Message Assistant — 7/10
Extension injects into LinkedIn compose. Generates networking message drafts. **User-driven sending only — no automation.**

## Hiring Website Validation

### T-261 [BE] Site Validator Service — 4/10
Given domain: check age (WHOIS), SSL, DNS records, presence in blocklists, legit company registration.

### T-262 [FE] Trust Badge UI — 3/10
Visual indicator on each application: trusted / unknown / suspicious.

---

# PHASE 3 — IF THIS BECOMES SAAS

### T-301 [BE] Stripe Integration — 5/10
### T-302 [BE] Tier-based Feature Gating — 4/10
### T-303 [BE] Usage Metering — 5/10
### T-304 [FE] Pricing & Billing Pages — 4/10
### T-305 [BE] Admin Dashboard — 5/10
### T-306 [SHARED] Customer Support Setup — 3/10
### T-307 [SHARED] GDPR Compliance — 6/10

---

# WORK SPLIT SUMMARY

## Your Friend (Backend-only)
- All DB schema and migrations
- All API endpoints
- All AI integrations (prompt design, model calls)
- Background jobs
- OAuth integrations
- Data scraping/external APIs

## You (Full-stack, Frontend-heavy)
- All React components and pages
- State management (Zustand or Redux Toolkit)
- All UI/UX decisions
- PDF rendering templates
- Browser extension
- Landing page
- Design system

## Shared (both need to align)
- API contracts (critical — agree before building)
- Auth flow
- Type definitions
- Deployment
- Testing strategy
- README and docs

---

# RECOMMENDED BUILD ORDER

1. **Week 1-2:** Phase 0 (T-001 to T-008) — setup done properly
2. **Week 3-4:** Auth (T-101 to T-104) + DB schemas (T-111, T-121, T-141)
3. **Week 5-7:** Application tracker core (T-112 to T-117) — **ship something usable**
4. **Week 8-10:** CV builder + AI features (T-122 to T-129)
5. **Week 11-12:** Tailoring + ATS (T-131 to T-135)
6. **Week 13:** Cover letters + follow-ups (T-141 to T-145)
7. **Week 14:** Scam/ghost job detection (T-151 to T-154)
8. **Week 15:** Polish (T-171 to T-176) → **LAUNCH MVP**
9. **Post-launch:** Pick Phase 2 features based on user feedback

Realistic timeline if both working 15-20 hrs/week: **3.5-4 months to MVP**.
If you're both full-time on it: 2 months.

---

# THINGS TO DECIDE NOW (BEFORE CODING)

- ORM choice: Prisma vs Drizzle (recommend Drizzle for SQL visibility on CV)
- Auth: library vs roll your own (recommend library)
- AI providers: which models for which tasks + fallback strategy
- Hosting: specific services locked in
- Design system: shadcn/ui vs custom
- State management: Zustand vs Redux Toolkit vs TanStack Query only
- PDF generation: Puppeteer vs react-pdf vs client-side

Lock these in an ADR doc (T-002) before writing real code.
