# Project Template: Voice Agent

Typical phase structure for a phone agent, VAPI bot, Retell agent, or call handling system.

**Default depth:** `standard` (5-8 phases)
**Typical stack:** Next.js 16 + Supabase + Retell AI / ElevenLabs / VAPI + Telnyx (phone numbers) + Vercel

## Typical Phases

### Phase 1: Foundation

**Goal:** Webhook endpoint for voice provider, Supabase wired, base call logging working.

**Typical success criteria:**
1. Webhook endpoint deployed and reachable
2. Supabase schema for `calls`, `transcripts`, `contacts` exists
3. Provider credentials configured (`RETELL_API_KEY`, `ELEVENLABS_API_KEY`, `TELNYX_API_KEY`)

### Phase 2: Agent Configuration

**Goal:** Voice agent answers calls with correct prompt and voice.

**Requirements covered:** Provider agent setup, system prompt, voice selection, greeting.

### Phase 3: Call Flow

**Goal:** Agent handles conversation, captures data, transfers when needed.

**Requirements covered:** Conversation state, data capture (name, email, appointment), transfer to human.

### Phase 4: Integrations

**Goal:** Post-call actions fire — CRM sync, Slack notification, email confirmation.

**Requirements covered:** CRM webhook, Slack bot, transactional email.

### Phase 5: Polish & Monitoring

**Goal:** Low latency, graceful errors, call quality monitoring, cost tracking.

**Requirements covered:** Latency optimization, silent call recovery, cost per call tracking, dashboard.

## Common Requirements Categories

- **CALL** — call handling and routing
- **CONV** — conversation flow
- **INTG** — external integrations (CRM, Slack, email)
- **MON** — monitoring and cost tracking
- **PROV** — voice provider configuration

## Research Flags

- **Provider choice** (Retell vs VAPI vs ElevenLabs direct) → `/qualia-research 1` to compare for this specific use case
- **Telephony setup** (DIDs, porting, SIP) → `/qualia-discuss` to lock decisions before wiring
- **Prompt engineering for voice** → `/qualia-research` for the agent config phase
