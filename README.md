# AI Workplace Productivity Assistant

A polished, session-only enterprise SaaS web application that helps professionals automate everyday workplace tasks using Artificial Intelligence. Built with TanStack Start, React, Tailwind CSS, and the Lovable AI Gateway.

This project is intentionally designed for **immediate, no-sign-in access**: there is no authentication, no user registration, no database, and no permanent storage of personal data. All AI-generated content and history are kept only in the current browser session, while user preferences are saved locally.

---

## Features Implemented

### Dashboard
- Large welcome hero section with a clear value proposition.
- Quick Action cards that jump to each of the four AI tools.
- Session-based productivity statistics (items generated, tools used, etc.).
- Recent activity list from the current browser session.
- Suggested prompts to help users get started quickly.

### Smart Email Generator
- Generate professional emails from recipient, subject, purpose, context, key points, and instructions.
- Tone selection: Formal, Friendly, Persuasive.
- Post-generation actions: Rewrite, Improve, Expand, Shorten, Correct Grammar, Copy, Edit, Print, Download, Clear, Regenerate.
- Editable output panel with live content changes.

### AI Research Assistant
- Summarize topics, pasted articles, reports, or long-form text.
- Tabbed output formats: Summary, Key Insights, Recommendations, Action Items, Executive Summary, Important Facts, Key Statistics.
- Editable outputs with Copy, Download, Regenerate, and Clear actions.

### AI Chatbot
- Modern conversational interface with message bubbles and streaming responses.
- Markdown rendering for AI responses.
- Suggested prompt chips: "Write a professional email", "Summarize this report", "Create meeting notes", "Draft a proposal", "Plan my workday", "Generate a project plan".
- Per-message Copy, Regenerate, Edit, and timestamps.
- Clear chat and scrollable conversation history.

### Smart AI Generator
- Generate a wide range of workplace documents: emails, reports, proposals, meeting notes, agendas, project plans, SOPs, policies, checklists, business letters, training materials, presentations, executive summaries, and custom documents.
- Customize tone, audience, context, length (Short / Medium / Long / Detailed), and instructions.
- Prompt template picker for common document types.
- Editable output with Copy, Print, Download, Regenerate, and Clear actions.

### History
- Lists all AI outputs created during the current browser session.
- View output in a drawer, Copy to clipboard, Delete single items, or Clear the entire session history.
- No permanent storage: history disappears when the session ends.

### Help
- Feature-by-feature explainer covering every AI tool.
- Quick start guide.
- FAQ section with accordion interaction.
- Productivity tips and per-tool guidance.

### Responsible AI
- Static guidance explaining AI limitations.
- Disclaimers on reviewing, editing, and verifying AI-generated content.
- Categories requiring extra care: business, legal, financial, academic, and official use.

### Settings
- Theme: Light, Dark, or System.
- AI Response Length: Short, Medium, Long.
- Creativity Level (temperature slider).
- Language and Default Email Tone.
- Animation toggle.
- Clear Session and Reset Preferences actions.
- Preferences persist in `localStorage`.

### Shared UX
- Fixed left sidebar and top navigation bar.
- Responsive layout: sidebar collapses on tablet and becomes an offcanvas drawer on mobile.
- Light and dark mode support.
- Smooth loading animations, skeleton loaders, and toast notifications.
- Empty states and success messages.
- Keyboard-accessible forms and chat composer.
- Reusable UI components (sidebar, topbar, page headers, output panels, theme provider).

---

## Technologies and Tools Used

- **Framework:** [TanStack Start v1](https://tanstack.com/start/) (full-stack React framework with SSR/SSG and server functions).
- **Build Tool:** Vite 7.
- **UI Library:** React 19.
- **Language:** TypeScript 5.
- **Styling:** Tailwind CSS 4 with `@theme` inline design tokens.
- **Component Library:** shadcn/ui primitives (Radix UI based).
- **Routing:** TanStack Router file-based routing.
- **Data Fetching:** TanStack Query.
- **AI SDK:** Vercel AI SDK (`ai`, `@ai-sdk/openai-compatible`, `@ai-sdk/react`) for streaming and structured generation.
- **AI Gateway:** Lovable AI Gateway (`https://ai.gateway.lovable.dev/v1`) using `openai/gpt-5.5`.
- **Markdown Rendering:** `react-markdown`.
- **State Management:** Zustand with `persist` middleware.
- **Session / Local Storage:** `sessionStorage` for session history, `localStorage` for preferences.
- **Icons:** Lucide React.
- **Form Handling:** React Hook Form + Zod.
- **Notifications:** Sonner toasts.
- **Date Utilities:** date-fns.
- **Charts:** Recharts.
- **Linting & Formatting:** ESLint, Prettier.

---

## Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) 18+ or [Bun](https://bun.sh/) (recommended for this project).
- A Lovable AI Gateway API key. The project is configured to use the Lovable AI Gateway; the key is provisioned automatically in the Lovable environment.

### Install Dependencies
```bash
bun install
```

Or with npm:
```bash
npm install
```

### Run the Development Server
```bash
bun dev
```

Or:
```bash
npm run dev
```

The app will be available at `http://localhost:8080` by default.

### Build for Production
```bash
bun build
```

Or:
```bash
npm run build
```

### Preview the Production Build
```bash
bun preview
```

Or:
```bash
npm run preview
```

### Lint and Format
```bash
bun lint
bun format
```

Or:
```bash
npm run lint
npm run format
```

### Notes
- No `.env` file is required for local development if the Lovable AI Gateway key is already injected by the platform. If you run the project outside Lovable, set `LOVABLE_API_KEY` in your environment.
- The application does not require any database, authentication provider, or external storage setup.
- Session history is cleared when the browser tab/session ends; preferences persist via `localStorage`.
