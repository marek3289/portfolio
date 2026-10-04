# marqueeio

Personal portfolio. Astro + plain CSS, no UI framework. Design source: Paper file
"Portfolio", page "Portfolio EN" (see `docs/design-spec.md`).

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # astro check + static build to dist/
npm run preview  # serve the built site
```

## Where to edit content

- `src/data/site.ts`: handle, headline, about text, current goal, email, social links,
  "updated" date, time zone for the footer clock.
- `src/data/projects.ts`: the project list (name, description, type, year, status, url,
  metric). The stats line is computed from it.
- `astro.config.mjs`: `site` (your domain, used for canonical and OG URLs).
- `public/favicon.svg`: monogram favicon.
- `src/styles/tokens.css`: colours, type sizes and spacing (light theme only).
