# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

## Localization

Two kinds of copy, two mechanisms:

- **UI strings** (buttons, headings, `aria-label`s) go through [Lingui](https://lingui.dev): `<Trans>`, `t` from `useLingui()`, and `msg` for module-level constants. Catalogs live in `src/i18n/locales/<code>/messages.po`; run `npm run i18n:extract` after changing any string.
- **Domain content** (words, pain scale, body zones, error screen) lives in typed catalogs in `src/i18n/locales/<code>/*.ts`, typed by `Messages` so a missing translation is a compile error. Read it with `useContent()`.

A release build (`npm run build`) fails if any language has untranslated UI strings; `npm run dev` and the tests fall back to English.

### Adding a language

1. Add the code to `locales` in `lingui.config.ts` and run `npm run i18n:extract`; translate the new `messages.po`.
2. Add `src/i18n/locales/<code>/` providing `Messages` (copy `en/` as a starting point).
3. Register it in `src/i18n/locales/index.ts` (`LOCALES`, `LOCALE_NAMES`) and `src/i18n/dateLocale.ts` (a `date-fns` locale for the calendar).
4. Check the two CSS rules that title-case English labels (`:root:lang(en)`) still suit the language.
