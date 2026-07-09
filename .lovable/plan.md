# AI Workplace Productivity Assistant — Build Plan

A polished, session-only SaaS: no auth, no database, no persistence beyond `sessionStorage`/`localStorage` for preferences and current-session history. AI powered by Lovable AI Gateway (default model `openai/gpt-5.5`), streaming where it makes sense.

## Visual direction
- Enterprise SaaS: blue/white/gray palette, rounded cards, soft shadows, generous spacing, subtle motion.
- Light + Dark mode via a class-based `dark` variant and a theme toggle in the top bar.
- Inspiration: Linear/Vercel density, Copilot/Notion AI warmth.
- Tokens defined in `src/styles.css` (`@theme inline`). No hardcoded colors in components.

## App shell
- `src/routes/__root.tsx`: real title/description + og/twitter meta, providers (QueryClient, ThemeProvider, Toaster, TooltipProvider, SessionStore).
- `src/routes/_app.tsx`: layout with fixed `Sidebar` (shadcn sidebar) + `Topbar` + `<Outlet />`.
- Sidebar items: Dashboard, Smart Email Generator, AI Research Assistant, AI Chatbot, Smart AI Generator, History, Help, Responsible AI, Settings. Collapsible to icon rail.
- Topbar: logo/wordmark, global search (client-side, filters session history + navigates), AI status dot (green when gateway reachable), theme toggle, notifications popover (session-only), Help button.
- No login/register/profile anywhere.

## Routes
```
src/routes/
  __root.tsx
  _app.tsx                          // layout with sidebar+topbar
  _app.index.tsx                    // Dashboard
  _app.email.tsx                    // Smart Email Generator
  _app.research.tsx                 // AI Research Assistant
  _app.chat.tsx                     // AI Chatbot
  _app.generator.tsx                // Smart AI Generator
  _app.history.tsx                  // Session history
  _app.help.tsx
  _app.responsible-ai.tsx
  _app.settings.tsx
  api/chat.ts                       // streaming chat server route
```
Each route sets its own `head()` (title, description, og:title, og:description).

## Pages

**Dashboard** — hero welcome section ("Welcome to AI Workplace Productivity Assistant" + description), 4 Quick Action cards linking to the tools, session stats (items generated, tokens saved, tools used, session started), recent activity list from session history, and suggested prompts.

**Smart Email Generator** — form: recipient, subject, purpose, context, key points (list), additional instructions, tone (Formal/Friendly/Persuasive). Actions: Generate, Rewrite, Improve, Expand, Shorten, Correct Grammar, Copy, Edit (inline contenteditable/textarea), Print, Download (.txt/.md), Clear, Regenerate. Output panel is editable.

**AI Research Assistant** — input: topic or pasted text. Outputs: Summary, Key Insights, Recommendations, Action Items, Executive Summary, Important Facts, Key Statistics (tabbed). All editable + copy/download/regenerate.

**AI Chatbot** — AI Elements-based chat (`Conversation`, `Message`, `MessageResponse`, `PromptInput`, `Shimmer`). Streaming via `useChat` → `/api/chat`. Suggested prompt chips ("Write a professional email", "Summarize this report", "Create meeting notes", "Draft a proposal", "Plan my workday", "Generate a project plan"). Markdown rendering, copy/regenerate/edit per message, timestamps, clear chat, scrollable.

**Smart AI Generator** — document type dropdown (emails, reports, proposals, meeting notes, agendas, project plans, SOPs, policies, checklists, business letters, training materials, presentations, executive summaries, custom). Fields: tone, audience, context, length (Short/Medium/Long/Detailed), instructions, prompt template picker. Output editable + copy/print/download/regenerate.

**History** — lists session outputs (type, title, timestamp, preview). Actions: View (drawer), Copy, Delete, Clear Session History. Reads from Zustand store persisted to `sessionStorage`.

**Help** — feature-by-feature explainer, quick start, FAQ (accordion), productivity tips, per-tool guidance.

**Responsible AI** — static content page: AI limitations, review/verify guidance, categories requiring extra care (legal/financial/medical/academic).

**Settings** — Theme (light/dark/system), AI Response Length (Short/Medium/Long), Creativity Level (slider → temperature), Language, Default Email Tone, Animation toggle, Clear Session button, Reset Preferences. Persisted in `localStorage`.

## AI backend
- `src/lib/ai-gateway.server.ts`: provider helper (`@ai-sdk/openai-compatible` → `https://ai.gateway.lovable.dev/v1`, `Lovable-API-Key` header, `structuredOutputs: true`).
- `src/routes/api/chat.ts`: streaming `POST` for chatbot via `streamText` + `toUIMessageStreamResponse`.
- `src/lib/ai.functions.ts`: `createServerFn` handlers for one-shot generations — `generateEmail`, `transformEmail` (rewrite/improve/expand/shorten/grammar), `researchAssist`, `generateDocument`. Each reads `LOVABLE_API_KEY` inside the handler, applies system prompt + user settings, returns text/structured output.
- Errors: 429 (rate-limited) and 402 (credits exhausted) surface as toast + inline banner. Requires `LOVABLE_API_KEY` — will be provisioned via `ai_gateway--create`.

## Session state
- Zustand store `useSessionStore` with `persist` middleware → `sessionStorage` for history entries and chat threads; `localStorage` for preferences (theme, defaults). No PII, no backend.

## Shared UI
- `AppSidebar`, `Topbar`, `ThemeProvider` (class-based dark), `PageHeader`, `ToolLayout` (input pane + output pane, responsive stacking), `OutputActions` (copy/print/download/regenerate/clear), `EditableOutput`, `PromptTemplatePicker`, `EmptyState`, `SkeletonLoader`, toast via existing `sonner`.
- AI Elements installed via `bun x ai-elements@latest add conversation message prompt-input shimmer` for the chatbot.
- Custom brand mark (generated small SVG/logo image) — no `Sparkles` icon as identity.

## Technical notes
- TanStack Start file-based routing; `_app` pathless layout groups authenticated-feeling shell (no actual auth).
- Semantic tokens only; add brand-blue scale + shadow tokens in `styles.css`.
- Responsive: sidebar collapses to icon on `md`, offcanvas on mobile; tool layouts stack.
- Accessibility: focus rings, keyboard nav for chat/composer, aria-labels on icon buttons.

## Out of scope
- Auth, database, permanent storage, user accounts, payments.
- File upload/parsing (text paste only for research).
- Real notifications backend (popover shows session-only toasts log).

## Deliverable checklist
- All 9 routes render with distinct `head()` metadata.
- 4 AI tools call Lovable AI Gateway successfully.
- Session history captures every generation.
- Theme toggle works; preferences persist in `localStorage`.
- No login/profile UI anywhere; no DB tables created.
