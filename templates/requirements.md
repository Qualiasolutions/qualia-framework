# Requirements: {Project Name}

**Defined:** {date}
**Core Value:** {from PROJECT.md — the one thing that must work}

Requirements are grouped by the milestone that delivers them. Each requirement
has a stable REQ-ID and is atomic, testable, and user-centric.

---

## Milestone 1 · {Name}

Short description of what this milestone delivers for the user.

### {Category}

- [ ] **{CAT}-01**: {user-centric, testable, atomic capability}
- [ ] **{CAT}-02**: {capability}

### {Category}

- [ ] **{CAT}-01**: {capability}

---

## Milestone 2 · {Name}

### {Category}

- [ ] **{CAT}-03**: {capability}
- [ ] **{CAT}-04**: {capability}

---

## Milestone 3 · {Name}

### {Category}

- [ ] **{CAT}-05**: {capability}

---

## Handoff

Fixed scope for every project. Do not reassign these elsewhere.

### Polish

- [ ] **HAND-01**: Every user-facing page has all interactive states (hover, focus, loading, error, empty)
- [ ] **HAND-02**: Responsive verified at 375 / 768 / 1440 / 1920px
- [ ] **HAND-03**: WCAG AA contrast + keyboard navigation verified

### Content + SEO

- [ ] **HAND-04**: Real copy replaces all placeholder text
- [ ] **HAND-05**: Meta tags, OG images, sitemap.xml, robots.txt present
- [ ] **HAND-06**: Analytics wired (Plausible / PostHog / GA)

### Final QA

- [ ] **HAND-07**: Full-flow test of every primary user journey
- [ ] **HAND-08**: Cross-browser verified (Chrome + Safari + Firefox)
- [ ] **HAND-09**: `/qualia-review` scored diagnostics reviewed, blockers resolved

### Handoff

- [ ] **HAND-10**: Production URL verified (HTTP 200, auth flow works, latency < 500ms)
- [ ] **HAND-11**: README updated with architecture, setup, API documentation
- [ ] **HAND-12**: Credentials document delivered to client (deploy tokens, admin accounts, third-party keys)
- [ ] **HAND-13**: Recorded walkthrough (Loom or equivalent) delivered
- [ ] **HAND-14**: `.planning/archive/` contains every milestone's verification reports
- [ ] **HAND-15**: Final `/qualia-report` submitted, `lifetime.milestones_completed` incremented

---

## Post-Handoff (v2)

Features acknowledged but deferred past initial handoff. Not in current journey.

### {Category}

- **{CAT}-XX**: {capability}

---

## Out of Scope

Explicit exclusions with reasoning. Prevents scope creep.

| Feature | Reason |
|---------|--------|
| {feature} | {why excluded} |

---

## Traceability

Populated during roadmap creation. Every v1 requirement maps to exactly one milestone + phase.

| Requirement | Milestone | Phase | Status |
|-------------|-----------|-------|--------|
| {CAT}-01 | M1: {name} | Phase {N} | Pending |

**Coverage:**
- v1 requirements (all feature milestones + Handoff): {X} total
- Mapped to milestones + phases: {Y}
- Unmapped: {Z}

---

## Requirement Quality Rules

1. **ID format:** `{CATEGORY}-{NUMBER}` — stable across the project's life
2. **User-centric:** "User can X" — not "System does Y"
3. **Atomic:** one capability per requirement
4. **Testable:** the observable behavior is nameable
5. **Independent:** minimal dependencies on other requirements
6. **Assigned to exactly one milestone:** no duplicates, no gaps

## Status Values

- **Pending** — not started
- **In Progress** — milestone is active, phase in progress
- **Complete** — verified as passing
- **Blocked** — waiting on external factor

---

*Last updated: {date}*
