---
name: new-screen
description: Add a new screen to the app — feature folder in src/features, component + CSS, route path, lazy router entry, optional tab, and Lingui strings in every language. Use when the user asks to add, create or scaffold a screen, page or route.
argument-hint: <ScreenName> [route path]
---

# New screen

Input: a screen name in PascalCase (e.g. `Journal`) and optionally a URL path. If no path is given, use the kebab-case name (`/journal`). Derive:

- `Name` — component name, PascalCase; the component is `<Name>Page`
- `name` — camelCase, used as the `ROUTES` key
- `feature` — folder name, kebab-case
- `path` — URL, kebab-case

Look at an existing screen first and match it: `src/features/settings/SettingsPage.tsx` is a good small reference.

## Steps

1. **Component** — `src/features/<feature>/<Name>Page.tsx`:

   ```tsx
   import { Trans } from '@lingui/react/macro'
   import { PageFrame } from '@/shared/layout'
   import { Greeting, TabBar } from '@/shared/ui'
   import './<Name>Page.css'

   export const <Name>Page = () => (
     <PageFrame>
       <Greeting />
       <div className="<feature>-wrapper">
         <h1 className="<feature>-title">
           <Trans>…</Trans>
         </h1>
       </div>
       <TabBar />
     </PageFrame>
   )
   ```

   Drop `<TabBar />` if the screen is a step inside a flow rather than a place of its own.

2. **Styles** — `src/features/<feature>/<Name>Page.css`. Start from `.settings-wrapper` / `.settings-title` in `SettingsPage.css`. Prefix every class with the feature name. Colours only from `src/styles/tokens.css`.

3. **Path** — add `<name>: '<path>'` to `ROUTES` in `src/routes/paths.ts`. For links with query params add a builder next to it, like `calendarPath`.

4. **Route** — in `src/router.tsx` add a `load<Name>Page` loader and a `lazy()` component like the others, add the loader to the list in `preloadRoutes`, and add `{ path: ROUTES.<name>, element: withSuspense(<<Name>Page />), errorElement }` to the router.

5. **Tab** (only if the screen is a top-level destination) — add an entry with a line icon to `TABS` in `src/shared/ui/TabBar/TabBar.tsx`, and update the expected text in `TabBar.test.tsx`. The tab bar is tight on small phones: ask before adding a fifth tab.

6. **Strings** — all UI copy through `<Trans>` / `t` / `msg`. Run `npm run i18n:extract`, then translate the new entries in `src/i18n/locales/it/messages.po` (feminine forms when addressing the user). Domain content (words, scales, body zones) goes into the typed catalogs instead — see `src/i18n/types.ts`.

7. **Test** — if the screen has behaviour beyond static text, add `<Name>Page.test.tsx` next to it using `render` from `@/test/render`, wrapped in a `MemoryRouter` (the `Greeting` and `TabBar` use router hooks).

## Check

Run `npx tsc -b && npm run lint && npm test`. Open the new route in the dev server (`hackathon-app` in `.claude/launch.json`, port 5173) in both languages, both themes, at phone width and on desktop.

Copy follows `.claude/DESIGN.md` and the tone in `.claude/CLAUDE.md`: short, warm, one main action per screen.
