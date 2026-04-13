# Architecture Research

**Domain:** {domain type}
**Researched:** {date}
**Confidence:** {HIGH/MEDIUM/LOW}

## Standard Architecture

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| {name} | {what it owns} | {how it's usually built} |

### Data Flow

```
[User Action]
    ↓
[Component] → [Handler] → [Service] → [Data Store]
    ↓              ↓           ↓            ↓
[Response] ← [Transform] ← [Query] ← [Database]
```

### Key Flows

1. **{flow name}:** {how data moves}
2. **{flow name}:** {how data moves}

## Recommended Project Structure

```
src/
├── {folder}/           # {purpose}
├── {folder}/           # {purpose}
└── {folder}/           # {purpose}
```

**Structure rationale:**
- **{folder}/:** {why organized this way}

## Suggested Build Order

Phases should follow this dependency order:

1. **{component}** — foundation, no dependencies
2. **{component}** — depends on 1
3. **{component}** — depends on 1, 2

## Anti-Patterns

### {Name}

**What people do:** {the mistake}
**Why it's wrong:** {the problem}
**Do this instead:** {correct approach}

## Integration Points

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| {service} | {how to connect} | {gotchas} |

## Sources

- {architecture references}
- {official documentation}

---
*Architecture research for: {domain}*
