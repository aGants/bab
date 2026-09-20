import { lingui, linguiTransformerBabelPreset } from '@lingui/vite-plugin'
import babel from '@rolldown/plugin-babel'
import react from '@vitejs/plugin-react'
import { createHash } from 'node:crypto'
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import type { Plugin } from 'vite'
import { defineConfig } from 'vitest/config'

/** Tells the service worker (public/sw.js) what this deploy consists of. It gets an id and the list
 * of hashed files in front of its code, so it can cache them up front and drop the previous
 * deploy's cache instead of letting old files pile up. The id is derived from the file names,
 * which carry content hashes, so it only changes when the app does. */
const precacheManifest = (): Plugin => {
  let outDir = 'dist'
  let assets: string[] = []
  return {
    name: 'precache-manifest',
    apply: 'build',
    configResolved: (config) => {
      outDir = path.resolve(config.root, config.build.outDir)
    },
    generateBundle: (_options, bundle) => {
      assets = Object.keys(bundle)
        .filter((file) => file.startsWith('assets/'))
        .map((file) => `/${file}`)
        .sort()
    },
    closeBundle: async () => {
      // the worker is copied out of public/ once everything else is written
      const worker = path.join(outDir, 'sw.js')
      const id = createHash('sha256').update(assets.join('\n')).digest('hex').slice(0, 10)
      const source = await readFile(worker, 'utf8')
      await writeFile(worker, `self.__BUILD__ = ${JSON.stringify({ id, assets })}\n${source}`)
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    // a release must not ship a language with untranslated strings; while developing they just fall back to English
    lingui({ failOnMissing: mode === 'production' }),
    // expands the `t` / `<Trans>` / `msg` macros at build time
    babel({ presets: [linguiTransformerBabelPreset()] }),
    precacheManifest(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
}))
