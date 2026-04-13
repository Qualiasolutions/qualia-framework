# Requirements: {Project Name}

**Defined:** {date}
**Core Value:** {from PROJECT.md — the one thing that must work}

## v1 Requirements

Initial release scope. Each maps to one roadmap phase.

### {Category 1}

- [ ] **{CAT}-01**: {user-centric, testable, atomic capability}
- [ ] **{CAT}-02**: {capability}
- [ ] **{CAT}-03**: {capability}

### {Category 2}

- [ ] **{CAT}-01**: {capability}
- [ ] **{CAT}-02**: {capability}

## v2 Requirements

Acknowledged but deferred to a future release. Not in current roadmap.

### {Category}

- **{CAT}-01**: {capability}
- **{CAT}-02**: {capability}

## Out of Scope

Explicit exclusions with reasoning. Prevents scope creep.

| Feature | Reason |
|---------|--------|
| {feature} | {why excluded} |

## Traceability

Which phases cover which requirements. Populated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| {CAT}-01 | Phase {N} | Pending |

**Coverage:**
- v1 requirements: {X} total
- Mapped to phases: {Y}
- Unmapped: {Z}

---

## Requirement Quality Rules

1. **ID format:** `{CATEGORY}-{NUMBER}` — `AUTH-01`, `CONT-02`, `SOCIAL-03`
2. **User-centric:** "User can X" — not "System does Y"
3. **Atomic:** One capability per requirement — not "User can login and manage profile"
4. **Testable:** "User can reset password via email link" — not "handle password reset"
5. **Independent:** Minimal dependencies on other requirements

## Status Values

- **Pending** — not started
- **In Progress** — phase is active
- **Complete** — requirement verified
- **Blocked** — waiting on external factor

---
*Last updated: {date}*
