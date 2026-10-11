# portfolio

Personal portfolio. Astro, Tailwind CSS, and shadcn/ui. Design source: Paper file
"Portfolio", page "Portfolio EN" (see `docs/design-spec.md`).

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # astro check + static build to dist/
npm run preview  # serve the built site
```

## Where to edit content

- `src/site.ts`: handle, headline, about text, email, social links, "updated" date,
  time zone, and the project list. The stats line is computed from the projects.
- `astro.config.mjs`: `site` (your domain, used for canonical and OG URLs).
- `public/favicon.svg`: monogram favicon.
- `src/global.css`: colour, type, and spacing tokens (light theme; `.dark` is defined and unused).
