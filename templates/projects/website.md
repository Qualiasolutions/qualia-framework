# Project Template: Website / Web App

Typical phase structure for a client website, SaaS landing page, dashboard, or marketing site.

**Default depth:** `standard` (5-8 phases)
**Typical stack:** Next.js 16 + React 19 + TypeScript + Supabase + Vercel

## Typical Phases

### Phase 1: Foundation

**Goal:** Project skeleton exists on Vercel with Supabase wired, auth working, and base layout rendering.

**Requirements covered:** Auth (sign up / log in / log out / session persistence), base layout, deploy pipeline.

**Typical success criteria:**
1. Site loads on Vercel preview URL
2. User can sign up with email + password
3. User can log in and stay logged in across refresh
4. Base layout renders with nav + footer

### Phase 2: Core Feature (primary)

**Goal:** The main value-delivering feature works end-to-end.

**Requirements covered:** Primary user capability (depends on project — posting, booking, searching, etc.)

### Phase 3: Core Feature (secondary)

**Goal:** Supporting features that make the primary feature usable.

**Requirements covered:** Profile, settings, admin panel, etc.

### Phase 4: Content & Marketing

**Goal:** Marketing pages, copy, images, SEO meta tags.

**Requirements covered:** Homepage hero, features section, pricing, about, contact.

### Phase 5: Polish & Launch

**Goal:** Site is production-ready.

**Requirements covered:** Responsive (mobile / tablet / desktop), animations, error states, empty states, a11y, SEO, analytics.

## Common Requirements Categories

- **AUTH** — authentication and sessions
- **PROF** — user profiles
- **CONT** — content / primary feature
- **ADMIN** — admin panel
- **MARK** — marketing pages
- **SEO** — SEO, sitemaps, analytics

## Research Flags

- **Niche domain integrations** (e.g., legal compliance, medical records, financial regulations) → run `/qualia-research N` before planning that phase
- **Complex auth** (SSO, multi-tenant, RBAC) → run `/qualia-discuss N` first
