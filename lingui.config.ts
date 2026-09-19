import { defineConfig } from '@lingui/cli'

// UI copy is extracted from the source into one catalog per language, next to the
// typed content copy (words, pain scale, body zones) in src/i18n/locales/<code>/.
// Adding a language: add its code to `locales`, run `npm run i18n:extract`, translate the
// new messages.po, and register the language in src/i18n/locales/index.ts.
export default defineConfig({
  sourceLocale: 'en',
  locales: ['en'],
  catalogs: [
    {
      path: '<rootDir>/src/i18n/locales/{locale}/messages',
      include: ['src'],
      exclude: ['**/*.test.*', '**/test/**'],
    },
  ],
})
