## Character

Sporty, bright and friendly — like a good team locker room, not a clinic. The app talks to a tired teenager on a phone on the bus home, so every screen asks one question and takes one tap to answer. Sensations are shown as living, moving word shapes; a small character in the World reflects how the body feels.

**Essentials:**

- Colours only from `src/styles/tokens.css`; `tokens.ts` mirrors them for SVG and inline styles.
- One main action per screen, as a full-width `Button` at the bottom, in thumb reach.
- Colour is never the only carrier of meaning: a level always shows its number, a signal always has words.
- `prefers-reduced-motion` is respected everywhere.

## Colour

Five brand colours that stay the same in both themes, plus neutral roles that flip between light and dark.

- **`anchor`** — deep teal. Main buttons, focus outlines, the "muscle signals" category.
- **`energy`** — lime. Energy & fuel, highlights and banners.
- **`signals`** — coral. Pain types.
- **`cycle`** — lavender. Cycle & hormones.
- **`ground`** — warm paper. The light background, and the base every neutral is mixed from.
- **`pink`** — rewards and the character's default body colour.

Neutrals (`ink`, `ink-muted`, `surface`, `surface-raised`, `border`, `overlay`) are `color-mix` of `ground` with black. The dark theme (`:root[data-theme='dark']`) redefines only these, so category colours read the same in both themes. Text sitting on a fixed light fill (lavender, pale coral) uses `ink-on-light`, which does not flip.

Each word category owns one colour (`src/entities/word/categories.ts`); don't reuse a category colour for unrelated UI on the same screen.

## Typography

- **Display** — Bricolage Grotesque, 800, italic, skewed −4°, tracking −0.05em (`.text-display`). For sensation words and big moments only.
- **Screen titles** — Bricolage Grotesque, 500, 32px.
- **Body** — Instrument Sans, 16px, line height 1.5 (`.text-body`).

Fonts are bundled with the app (`src/styles/fonts`), not loaded from Google Fonts, so they work offline.

## Layout

- On a phone the app is full-bleed; from 700px wide it sits in a phone-shaped frame (`PageFrame`, max 430px) on a dark backdrop.
- Every screen: `PageFrame` → `Greeting` bar → content → `TabBar`. Steps inside a flow (check-in) have no tab bar.
- Side padding 16–20px (`--padding`), 28px between sections.
- Touch targets at least 48px tall; the main button is 56px.

## Shapes and depth

- Rounded everything: pills for buttons and chips, 14px+ radii for inputs and cards.
- Surfaces separate by `surface` → `surface-raised`, not by borders. Shadows stay soft and low (`0 8px 10px rgb(0 0 0 / 8%)` on the main button).

## Words and signals

- Each word has an intensity (0–2) that shapes its card art: blunt words are soft blobs, sharp ones get spikier.
- Each word has a signal: normal, pay attention, or stop and seek support. The summary explains it in words and gives a practical recommendation — never a diagnosis.
- The pain scale is a 0–10 VAS with a plain-language label per level ("Barely there", "Moderate"). The number and its label are always shown together. Words that aren't pain (strong, light) don't use the pain scale.

## Motion

- Word shapes drift and breathe slowly; the hot word throbs and lifts. Nothing flashes or shakes.
- State changes take about 200ms with `ease`/`ease-out`.
- With `prefers-reduced-motion: reduce`, drifting and hopping stop, and changes happen instantly.

## Icons

Line icons, 24px, `stroke-width` 1.8, rounded caps and joins, in `currentColor` (see `TabBar.tsx`).

## Do and don't

### Do

- Short, direct, encouraging copy. One thought per line.
- Show the number next to any level colour.
- Leave "Coming soon" controls visible but dimmed via `useComingSoon`, rather than hiding them.

### Don't

- Medical claims, diagnoses, or pressure ("you missed 3 days!").
- New colours outside the tokens, or a category colour used as a generic accent.
- Heavy shadows, flicker, or autoplaying attention-grabbers.
