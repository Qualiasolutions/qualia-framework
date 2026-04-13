# Project Template: AI Agent / Chatbot

Typical phase structure for a chatbot, AI assistant, tool-calling agent, or RAG system.

**Default depth:** `standard` (5-8 phases)
**Typical stack:** Next.js 16 + Supabase + OpenRouter (or direct provider) + Vercel AI SDK

## Typical Phases

### Phase 1: Foundation

**Goal:** Project skeleton with Supabase wired, OpenRouter API configured, base chat page rendering.

**Typical success criteria:**
1. Site loads on Vercel preview URL
2. Chat page renders with input box
3. Environment variables configured (`OPENROUTER_API_KEY`)

### Phase 2: Core Agent Logic

**Goal:** Agent responds to messages with streaming.

**Requirements covered:** System prompt, chat completion, streaming response, message history display.

### Phase 3: Tool Calling (if needed)

**Goal:** Agent can invoke tools (search, database, APIs) and return results.

**Requirements covered:** Tool definitions, tool execution, multi-step agent loop.

### Phase 4: Memory & Persistence

**Goal:** Conversations persist across sessions, user can see history.

**Requirements covered:** Database schema for conversations, load/save, conversation list.

### Phase 5: Polish & Guardrails

**Goal:** Rate limiting, error handling, content moderation, cost tracking.

**Requirements covered:** Rate limits per user, graceful errors, abuse prevention, usage analytics.

## Common Requirements Categories

- **AGENT** — core agent logic and prompting
- **TOOL** — tool calling and integrations
- **CONV** — conversations and history
- **RATE** — rate limiting and abuse prevention
- **AUTH** — authentication

## Research Flags

- **Domain-specific prompting** (legal, medical, financial advice) → run `/qualia-research` for the prompt engineering phase
- **RAG over specific datasets** (vector DB, chunking strategy) → `/qualia-discuss` before planning
- **Multi-step agent orchestration** → `/qualia-discuss` to lock tool boundaries before planning
