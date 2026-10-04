// @ts-check
import { defineConfig, fontProviders } from "astro/config";

// Fonts are self-hosted from the installed Fontsource packages (no CDN). Only
// the Latin subset is used since the site is English. Astro generates
// metric-matched fallback faces, so text doesn't shift when the fonts load.
export default defineConfig({
  // TODO: replace with the real domain (used for canonical and OG URLs).
  site: "https://example.com",
  fonts: [
    {
      provider: fontProviders.local(),
      name: "Geist",
      cssVariable: "--font-sans",
      fallbacks: ["sans-serif"],
      options: {
        variants: [
          {
            src: ["@fontsource-variable/geist/files/geist-latin-wght-normal.woff2"],
            weight: "100 900",
            style: "normal",
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "Geist Mono",
      cssVariable: "--font-mono",
      fallbacks: ["monospace"],
      options: {
        variants: [
          {
            src: ["@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2"],
            weight: "100 900",
            style: "normal",
          },
        ],
      },
    },
  ],
});
