# bayana_frontend

Frontend for Bayana — React + TypeScript + Vite with Tailwind CSS v4.

> This branch holds the **framework baseline only** (tooling, config, entry point,
> design tokens and fonts). Feature work is merged in from `feat/*` branches.

## Stack
- React 19 + TypeScript
- Vite (Rolldown) + `@vitejs/plugin-react` (React Compiler)
- Tailwind CSS v4
- React Router + ESLint

## Getting started
```bash
npm install
cp .env.example .env   # adjust for your backend
npm run dev
```

## Scripts
- `npm run dev` — start the dev server
- `npm run build` — typecheck + production build
- `npm run lint` — run ESLint
- `npm run preview` — preview the production build

## Branches
- `main` / `qa` / `dev` — framework baseline; implementation merged in per stage.
- `feat/*` — feature development.
