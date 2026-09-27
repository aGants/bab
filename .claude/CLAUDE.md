@../README.md
@DESIGN.md

## Stack

Client-only PWA, no backend. Vite 8, React 19, TypeScript 6, React Router 7 (import from `react-router-dom`, data router in `src/router.tsx`, paths in `src/routes/paths.ts`), Lingui 6 for UI strings, date-fns 4, react-day-picker. Tests: Vitest + Testing Library + jsdom. Lint: Oxlint. The service worker is hand-written (`public/sw.js`); `vite.config.ts` injects the precache list at build time.

Styling is plain CSS next to each component (`Button.tsx` + `Button.css`, imported as `import './Button.css'`), class names prefixed with the component (`settings-title`, `coming-soon__pill`). No CSS Modules, no Tailwind, no UI kit. No global state library: data lives in `localStorage` behind repositories in `src/entities/*`, read through small hooks (`useUserProfile`, `useDailyLog`). Import from `src` through the `@/` alias.

## Layout of `src`

- `entities/` — data models and storage. Repositories are async interfaces over `createStoredJson` (`src/shared/lib/storedJson.ts`), so a backend can replace `localStorage` without touching the UI.
- `features/` — screens and their logic, one folder per feature.
- `shared/` — `ui/` (Button, TabBar, Greeting, Slider…, re-exported from `@/shared/ui`), `layout/` (`PageFrame`), `lib/`.
- `i18n/` — Lingui runtime, `.po` catalogs and typed content catalogs per language.

## Who this is for

Teenage girl athletes, usually on a phone after training. The app helps them notice and name a body sensation, not diagnose it. Copy is short, warm and plain: no medical promises, no pressure or guilt. Languages with grammatical gender address the user in the feminine.

## Rules the tooling won't catch

- Colours come from `src/styles/tokens.css` (and its JS mirror `tokens.ts` — keep the two in sync). No new hex values in components.
- Dates are stored as local `YYYY-MM-DD` keys via `toDateKey` / `todayKey` from `src/shared/lib/dateKey.ts`. Never use `toISOString()` for a day.
- Stored data outlives releases. When the shape of something in `localStorage` changes, normalise the old shape on read (see `LEGACY_ZONES` in `checkInRepository.ts`) instead of breaking existing entries.
- Word ids, body zone ids and category ids are persisted — never rename or translate them.
- UI strings go through Lingui (`<Trans>`, `t` from `useLingui()`, `msg` for module-level constants), then `npm run i18n:extract` and translate the new entries in every `messages.po`. Domain copy (words, VAS scale, body zones) goes into the typed catalogs in `src/i18n/locales/<code>/*.ts` for every language.
- Read `localStorage` through `safeStorage` / `createStoredJson`, never directly: it throws in Safari private mode.
- Motion respects `prefers-reduced-motion`.

## Privacy

Check-in data stays on the device. The only network traffic besides the app itself is the anonymous Vercel page-view ping. Don't add analytics events, sync, or third-party SDKs without asking first.

## Code style

- Functions are `const` arrow functions, not `function` declarations.
- Match the surrounding files: 2-space indentation, single quotes, no semicolons.
- Comments explain *why*, in full sentences, as in the existing code.

## Before calling a task done

`npx tsc -b && npm run lint && npm test`. If UI strings changed, also `npm run i18n:extract`.

The dev server runs on port 5173 (`hackathon-app` in `.claude/launch.json`). The service worker only registers in production builds; test PWA behaviour with `hackathon-prod-preview` (`npm run build && npm run preview`, port 4173).

## Language

Code, comments, commits and docs are in English. Commit messages are short, lowercase, and describe the change from the user's side ("scroll the check-in flow to the top when the step changes").
