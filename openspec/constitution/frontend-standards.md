# Frontend standards

Next.js 15 App Router · React 19 · TypeScript · Tailwind CSS

## File layout

| Artifact | Path pattern |
| -------- | ------------ |
| Page | `frontend/app/**/page.tsx` |
| Feature component | `frontend/components/{Name}.tsx` |
| UI primitive | `frontend/components/ui/{Name}.tsx` |
| API client | `frontend/lib/api.ts` |
| Hook | `frontend/hooks/use{Feature}.ts` |
| Tests | `frontend/tests/{Component}.test.tsx` |

## Components

- Named exports with `interface {Name}Props`
- Client components: `"use client"` at top when using hooks/state
- Pages: loading skeleton → error card → content (match existing pages)
- Semantic HTML: `section`, headings, `aria-labelledby` where appropriate

## Data fetching

- All HTTP through `frontend/lib/api.ts` — add methods to the `api` object
- Mirror backend paths exactly (no `/api` prefix — see `api-standards.md`)
- Types in `lib/api.ts` must match backend `*Read` schemas
- Hooks encapsulate fetch + local state; pages stay thin

## Styling

- Tailwind utilities + shared classes in `frontend/app/globals.css`
- Semantic tokens from `tailwind.config.ts`:
  - `page`, `surface`, `foreground`, `accent`
  - `status-todo`, `status-in-progress`, `status-done`, `status-blocked`
- Font: DM Sans (UI), JetBrains Mono (code)
- Light theme only — do not introduce dark/ink/cream palettes
- Prefer existing `.card`, `.btn-primary`, `.page-title` classes

## Do not

- Add React Query, SWR, or Redux
- Fetch directly from components (use hooks + `api`)
- Hardcode `http://localhost:8000` — use `NEXT_PUBLIC_API_URL` via `lib/api.ts`
- Create one-off CSS files — extend Tailwind/globals
