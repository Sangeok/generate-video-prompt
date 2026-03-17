# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start Next.js dev server (port 3000)
npm run build        # Build for production
npm run lint         # Run ESLint
npm run inngest-dev  # Start Inngest dev server (port 8288) — required for local job processing
```

Both `npm run dev` and `npm run inngest-dev` must run simultaneously for the full pipeline to work locally.

## Architecture & Conventions

@docs/architecture/fsd-architecture-guidelines.md
@docs/conventions/file-naming.md
@docs/conventions/naming-conventions.md
@docs/conventions/typescript-clean-code-guide.md
@docs/conventions/frontend-readability-guide.md
@docs/conventions/frontend-cohesion-guide.md
@docs/conventions/frontend-coupling-guide.md
@docs/conventions/frontend-predictability-guide.md

This project uses **Feature-Sliced Design (FSD)**.

### Layer structure (high → low)
```
app/         → Next.js App Router: layout, routing, global providers
fsd/pages/   → Page-level composition
fsd/widgets/ → Multi-feature compositions (not used yet)
fsd/features/generate-video-prompt/  → Main feature slice
fsd/entities/                        → Domain models (not used yet)
fsd/shared/  → Generic UI (Button, Input), lib utilities (ai-model, tts, caption, parse-gemini)
```

### Strict dependency rules
- Upper layers import only from lower layers
- Same-layer slices cannot import each other
- Each slice exposes its public API only via `index.ts`

  **Bad**: `import { Foo } from 'features/generate-video-prompt/ui/Foo'`
  **Good**: `import { Foo } from 'features/generate-video-prompt'`

### Segment naming
Segments are named by **purpose**, not shape. Use `ui/`, `model/`, `api/`, `config/` — never `types/`, `hooks/`, or `components/` as segment names. Domain types go in `model/types.ts`.

## Video generation pipeline

The app generates video assets from a topic + visual style via an Inngest-orchestrated pipeline:

1. User submits form → `triggerVideoPrompt` server action sends `create/video.prompt` event to Inngest
2. Inngest function (`fsd/features/generate-video-prompt/api/inngest-function.ts`) runs three steps:
   - **Step 1**: Generate YouTube script (narration + 5 scenes) via Gemini 2.5 Flash
   - **Step 2** (parallel): Generate image prompts for each scene + TTS audio via Deepgram
   - **Step 3**: Generate captions (speech-to-text) from audio via Deepgram
3. Client polls `/api/inngest-run/[eventId]` every 2 seconds until `COMPLETED` or `FAILED`
4. Results displayed in `VideoPromptResult` component

Step-level errors inside Inngest steps trigger automatic retry with memoization invalidation.

## Key files

| File | Purpose |
|------|---------|
| `fsd/features/generate-video-prompt/api/inngest-function.ts` | Inngest workflow — all pipeline steps |
| `fsd/shared/lib/ai-model.ts` | Gemini session management |
| `fsd/shared/lib/tts.ts` | Deepgram TTS |
| `fsd/shared/lib/caption.ts` | Deepgram STT |
| `fsd/features/generate-video-prompt/model/use-generate-video-prompt-form.ts` | Form state + polling orchestration |
| `fsd/features/generate-video-prompt/config/style-options.ts` | Visual style configs (skeleton, history) |

## Environment variables

```
GEMINI_API_KEY
DEEPGRAM_API_KEY
INNGEST_BASE_URL      # default: http://localhost:8288
INNGEST_SIGNING_KEY   # optional, for auth
```
