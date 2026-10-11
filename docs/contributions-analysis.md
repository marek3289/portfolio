# Contributions heatmap on maxkatz.me

Observed on 11 October 2026 from the Performance section of `https://maxkatz.me/`. The graph is a Sunday-column, 53-week grid of the trailing 365 days, rendered as static markup. It is not a live GitHub embed, and the client does not calculate intensity.

## How this was observed

REA MCP tools are not connected in this Cursor session, so the investigation used the REA 6.4.0 CLI (`list_browser_targets`, `inspect_web_page`, `inspect_web_event_listeners`). That is the same CDP engine the MCP server exposes.

The already-running Chrome process was not listening on `http://127.0.0.1:9222`. A separate Chrome 154 was started with remote debugging on that port and a temporary profile, then opened to the site. Findings below are from that page, not from the user’s existing Chrome 151 window.

| Question                                                                                      | Source                                                                                             |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Page identity, accessibility names, script inventory, source-map URLs, direct event listeners | REA                                                                                                |
| Attribute values, computed style, box positions, RSC payload, forced `:hover`, 390px layout   | Chrome DevTools, because REA’s DOM record keeps attribute names and text lengths only              |
| Requests during a reload                                                                      | DevTools. A second REA capture taken across a reload was attach-limited and recorded zero requests |

REA evidence IDs: target list `ev_06e9e7eb8160d4e2b1a1b16b87682f6adf38f9a0a4e4f91212b3abd92d582dfa`, page inspection `ev_56739e1f7f8ba7ffae01b4a976f90eb627240808d57b0f8520967f571a886585`, script sources `ev_ec1cf83ad3b3bfbc97a3d2d885e8f6d13cac1c6869a6bd5884b2cd458d3d3861`, cell listeners `ev_fac534e3220c8fc9bcacfbb6cf2819f8a490b79a41fdee1cbe98f8412f1262f3`, section listeners `ev_0feac3ac703066bdedaef72aef204beca4b8a56ed21cc2d2492cf7570dec9c6f`, empty reload capture `ev_aa1b5380f27f6b48881d57821e78ccc3325a0ab243e4b10d0d2d04becf208a5b`.

## Component architecture

Next.js App Router, server-rendered. The Performance block is a normal document section, not a canvas or an iframe. The client bundle does not contain the graph component: every cell arrives already built, both in the HTML and in the React flight payload (`self.__next_f`).

```text
section.flex.flex-col.gap-5
  aria-labelledby="performance-heading"
  h2#performance-heading
    "Performance"
  div
    div.no-scrollbar.max-w-full.scroll-fade-x.overflow-x-auto.overflow-y-hidden
      style token: --scroll-fade-size: 1.75rem
      div.w-max
        style token: --contribution-gap: 2px
        div[aria-hidden="true"].mb-1.5.grid.h-3.gap-[var(--contribution-gap)]
          .text-[12px].leading-none.text-muted-foreground
          inline style: grid-template-columns: repeat(53, 0.625rem)
          span.whitespace-nowrap × 53
        ol.grid.grid-flow-col.grid-rows-7.gap-[var(--contribution-gap)]
          aria-label="5,049 GitHub contributions in the last year"
          inline style: grid-template-columns: repeat(53, 0.625rem)
          li.squircle.size-2.5.rounded-cell.bg-foreground/{10|25|45|60|75} × 365
    p.mt-2.text-[12px].text-muted-foreground
      text nodes: "5,049" + " last year"
```

Flight keys confirm the same tree. Week labels are `span` nodes keyed by the Sunday that starts that column (`2025-10-12`, `2025-10-19`, …). Cells are `li` nodes keyed by ISO date (`2025-10-12`). The caption is one paragraph whose children are the two strings `"5,049"` and `" last year"`, with no extra wrapper and no separate color on the number.

There is no weekday axis and no color legend.

## Grid, type, and color

Measured at a 1200×941 viewport, device pixel ratio 2. Root font size is 16px. `--spacing` is `0.25rem`.

| Piece                  | Measured                                                                         |
| ---------------------- | -------------------------------------------------------------------------------- |
| Columns × rows         | 53 × 7                                                                           |
| Cell                   | 10×10px (`size-2.5` → `calc(var(--spacing) * 2.5)` = `0.625rem`)                 |
| Gap                    | 2px on both axes (`--contribution-gap: 2px`)                                     |
| Pitch                  | 12px, so adjacent cells are 10px apart plus a 2px gap                            |
| Grid box               | 634×82px. Width is `53×10 + 52×2`. Height is `7×10 + 6×2`                        |
| Cell radius            | 30% (`--cell-radius: calc(30% * 1)` via `.rounded-cell`)                         |
| Corner shape           | `corner-shape: squircle` on `.squircle`                                          |
| Month row              | 53 tracks of `0.625rem`, height 12px (`h-3`), margin-bottom 6px (`mb-1.5`)       |
| Month type             | 12px / 12px, weight 400, Geist, `--muted-foreground`                             |
| Heading                | “Performance”, 16px / 24px, weight 400, Geist, `--foreground` (`lab(94.2% 0 0)`) |
| Section stack          | `gap-5` = 20px between the heading and the block under it                        |
| Caption                | 12px / muted, `mt-2` (8px) under the scroller                                    |
| Page column            | `main` max-width 700px (`.max-w-page` → `--breakpoint-page`), gap 40px           |
| Page padding at 1200px | 56px top, 32px inline (`pt-14`, `sm:px-8`)                                       |
| Page background        | `lab(3.04863% 0 0)`                                                              |

Cells are the foreground color mixed with transparent, not GitHub green. The utilities that match the computed pixels are:

| Class              | Authored color                                            | Cells | Counts in this year |
| ------------------ | --------------------------------------------------------- | ----- | ------------------- |
| `bg-foreground/10` | `color-mix(in oklab, var(--foreground) 10%, transparent)` | 38    | 0 only              |
| `bg-foreground/25` | 25% mix                                                   | 274   | 1–28                |
| `bg-foreground/45` | 45% mix                                                   | 41    | 30–55               |
| `bg-foreground/60` | 60% mix                                                   | 7     | 59–84               |
| `bg-foreground/75` | 75% mix                                                   | 5     | 88–114              |

Computed background for a `/45` cell was `oklab(0.949998 -0.00000941753 0.0000221729 / 0.45)`. The stylesheet also contains an earlier `background-color: var(--foreground)` rule for the same opacity classes; the color-mix rule is the one that wins.

The caption total, the list’s accessible name, and the sum of the 365 cell counts are the same number: 5,049.

## Date mapping and month labels

Verified for this render:

- 365 cells, one per day, from 2025-10-12 through 2026-10-11 inclusive. That is the trailing year ending on the day the page was loaded. 11 October 2026 was a Sunday, and 12 October 2025 was also a Sunday, so both ends of a 365-day window fall on Sunday.
- `grid-auto-flow: column` and `grid-template-rows: repeat(7, 10px)`. Cell index `i` is column `floor(i / 7)`, row `i % 7`.
- Row 0 of this render is Sunday. The first column is 12–18 October 2025 (Sunday–Saturday). The last column contains only 11 October 2026, because index 364 lands in row 0. Future days are not padded.
- Each month span is one grid cell wide (10px) with `whitespace-nowrap`, so the word overflows visibly into the following tracks. Empty spans still occupy a column.
- A column is labeled only when that Sunday–Saturday week contains the 1st of a month. The label is the English abbreviation of that month (`Nov` … `Oct`). All 53 weeks match this rule. October 2025 has no label because 1 October 2025 is before the window. October 2026 is labeled on the week of 27 September 2026, which contains 1 October.

No week in this range contains two month starts, so a collision rule was not observed.

Because the page was loaded on a Sunday, a fixed “rows are always Sunday–Saturday” rule and a “first row is whatever weekday the 365-day window starts on” rule produce the same grid. Which one the server uses on other weekdays was not observed.

## Hover, tooltip, animation

- Each `li` sets the same string on `title` and `aria-label`. Examples: `32 contributions on October 12, 2025`, `1 contribution on October 16, 2025`, `No contributions on October 17, 2025`. Singular and plural are both real.
- REA found no listeners on the first cell or on the section. That call does not see delegated listeners.
- Forcing `:hover` in DevTools left background, transform, shadow, filter, opacity, and scale unchanged. The cell class list has no `hover:` utility.
- No `[role=tooltip]` node was in the document. The site does ship a tooltip component (used elsewhere; its content class is in `1liy1ao56cp5u.js`), and the heatmap does not use it.
- The native browser tooltip that `title` produces was not opened. REA does not dispatch pointer events, so delay, type, and placement of that tooltip are unverified and are the browser’s, not the page’s.
- Cell paint has no dedicated transition or keyframes. The only motion on this block is the scroll fade.

The scroller uses `overflow-x: auto`, `overflow-y: hidden`, and `.no-scrollbar` (`scrollbar-width: none`, and `::-webkit-scrollbar { display: none }`). `.scroll-fade-x` masks the inline edges with `--scroll-fade-size: 1.75rem` (28px). Where `animation-timeline: scroll()` exists, `scroll-fade-reveal-s` and `scroll-fade-reveal-e` run on `scroll(self inline)` and reveal or hide those edges. At scroll start only the end fade is visible. At 1200px the grid fit the column (`clientWidth` 636, `scrollWidth` 634) and the mask collapsed to nothing. At 390×844 the scrollport was 350px wide against a 634px grid, and the mask faded the right 28px.

## Responsive behavior

Cell size does not change. The grid stays 634px and the page scrolls it horizontally.

| Viewport | What was measured                                                                                   |
| -------- | --------------------------------------------------------------------------------------------------- |
| 1200px   | `main` padding `56px 32px 0`, content box 636px, graph fits, no fade                                |
| 390px    | `main` padding `32px 20px 0` (`pt-8`, `px-5`), scrollport 350px, horizontal scroll, right-edge fade |

`sm` is the point where horizontal padding switches from 20px to 32px. From the measured sizes, the grid fits once the content box reaches 634px, which is around a 698px viewport. That threshold is calculated from the 1200px and 390px measurements, not from a third viewport.

## Data flow

1. The document is `https://maxkatz.me/`. A DevTools reload recorded that document, one CSS chunk, the JS chunks, the Geist woff2, `favicon.svg`, `464496a7bbd717c5/script.js`, and `464496a7bbd717c5/view`.
2. `script.js` is a Vercel Web Analytics helper (`localStorage` key `__va_attribution`). It is not the heatmap.
3. No request to `github.com`, the GitHub API, or GraphQL was in that reload. Contribution counts are already in the HTML and the flight payload.
4. REA’s captured external scripts have no `sourceMappingURL`. Source maps were not available to fetch. REA also dropped URL-less inline scripts; the flight payload was read from those inline scripts in DevTools.
5. The flight payload has no level function, no quartile math, and no `github.com/users/...` URL. Each cell is a finished props object: date key, `aria-label`, `title`, and opacity class.
6. JSON-LD `sameAs` and the social links point at `https://github.com/maxktz`. That identifies the author. It does not, by itself, prove which account was counted. The heatmap markup never names the account.

### Intensity

The client does not compute intensity. Across all 365 cells, count maps to exactly one class, and this partition fits every cell:

```text
step = maxCount / 4          # maxCount is 114, step is 28.5
0            → /10
(0, step]    → /25           # observed 1–28
(step, 2·step] → /45         # observed 30–55; 2·step is 57
(2·step, 3·step] → /60       # observed 59–84; 3·step is 85.5
(3·step, max] → /75          # observed 88–114
```

`Math.ceil(maxCount / 4) === 29`, with cuts at 29, 58, and 87, also fits, because the boundary counts 29, 56–58, and 85–87 do not appear in this year. The comparison operator at those edges is not recoverable from this dataset.

This is not GitHub’s quartile scale. Quartiles of the 327 positive days are about 4, 9, and 19.5, and those cuts do not match the classes. A fixed 0 / 30 / 60 / 90 scale also fails: 59 is already `/60`, and 84 is still `/60`.

## Suggested React component

```text
ContributionCalendar
  props: days[{ date: ISO, count: number }], total: number
  levelFor(count, maxCount) → 0..4
  weeks = group days into Sunday-start columns of up to 7
  month label for a column = month of the day-number 1 inside that week, else blank

  <section aria-labelledby="performance-heading">
    <h2 id="performance-heading">Performance</h2>
    <div>
      <div class="scroller">          // overflow-x, hidden scrollbar, scroll fade
        <div class="track">           // --contribution-gap: 2px; width: max-content
          <div aria-hidden class="months" style="grid-template-columns: repeat(N, 0.625rem)">
            <span class="whitespace-nowrap" />
          </div>
          <ol
            aria-label={`${totalLabel} GitHub contributions in the last year`}
            style="grid-template-columns: repeat(N, 0.625rem)"
          >
            <li
              title={label}
              aria-label={label}
              class={opacityClass[level]}
            />
          </ol>
        </div>
      </div>
      <p class="caption">{totalLabel} last year</p>
    </div>
  </section>
```

`label` is `No contributions on ${longDate}`, `${count} contribution on ${longDate}`, or `${count} contributions on ${longDate}`. `totalLabel` is the total grouped with `en-US` thousands separators. `N` is the number of week columns, 53 for a full trailing year.

Keep the opacity decision on the server, next to the fetch that produces the counts, and ship the class with the day. The browser then only lays out markup.

## Implementation considerations

- Fetch the year at build or request time and serialize cells. Do not call GitHub from the browser if the goal is to match this page. A runtime fetch would be a different architecture.
- Store ISO dates. Derive the long English label and the month abbreviation at render so the accessible name, `title`, and month row cannot drift.
- Set the column count in inline `grid-template-columns` on both the month row and the `ol`. Class-only `grid-flow-col` / `grid-rows-7` is also present, and the explicit repeat is what locks the month row to the same 53 tracks.
- Omit empty future cells. The last column is short when the range does not end on Saturday.
- Decide, and test on a non-Sunday, whether row 0 is always Sunday or is the weekday of `today - 364 days`. This capture cannot tell those apart.
- Map intensity from the year’s maximum, not from quartiles, and keep zero on its own step (`/10`). Until the boundary counts exist, treat `max / 4` and `ceil(max / 4)` as both compatible with this year.
- Use foreground alpha on the page background. Five steps: 10, 25, 45, 60, 75.
- `corner-shape: squircle` is additive. The 30% radius is the fallback that already paints in this Chrome. Keep the radius even where `corner-shape` is ignored.
- Do not scale cells down on small screens. Scroll the 634px track, hide the scrollbar, and fade the overflowing edge by 28px. The fade should follow scroll position, including the `animation-timeline` fallback that pins both edges on when scroll timelines are missing.
- Leave the month row `aria-hidden`. The day `aria-label` is the accessible description. The list name carries the total.
- The heading is 16px weight 400, the same size as body text. The caption and months are 12px muted.
