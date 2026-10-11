// @ts-check
import { fileURLToPath } from 'node:url'
import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, fontProviders } from 'astro/config'

/** @param {boolean} refresh */
async function warmContributions(refresh) {
  const { warmContributionCalendar } = await import('./src/lib/contributions/index.ts')
  await warmContributionCalendar({ refresh })
}

export default defineConfig({
  // TODO: replace with the real domain (used for canonical and OG URLs).
  site: 'https://example.com',
  integrations: [
    react(),
    {
      name: 'contribution-cache',
      hooks: {
        'astro:server:setup': () => warmContributions(false),
        'astro:build:start': () => warmContributions(true),
      },
    },
    {
      name: 'home-page',
      hooks: {
        'astro:config:setup'({ injectRoute }) {
          injectRoute({
            pattern: '/',
            entrypoint: new URL('./src/index.astro', import.meta.url),
          })
        },
      },
    },
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Geist',
      cssVariable: '--font-geist',
      fallbacks: ['sans-serif'],
      options: {
        variants: [
          {
            src: ['@fontsource-variable/geist/files/geist-latin-wght-normal.woff2'],
            weight: '100 900',
            style: 'normal',
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Geist Mono',
      cssVariable: '--font-geist-mono',
      fallbacks: ['monospace'],
      options: {
        variants: [
          {
            src: ['@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2'],
            weight: '100 900',
            style: 'normal',
          },
        ],
      },
    },
  ],
})
