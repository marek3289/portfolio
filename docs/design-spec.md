# Design spec: northlight portfolio

Merged from Paper artboards in the "Portfolio" file, page "Portfolio EN":

- **6-Final-home-desktop**: primary source of truth for content, structure and desktop layout.
- **Index-desktop-light / -dark, Index-mobile-light / -dark, Index-states**: design-system
  reference for everything 6-Final doesn't specify (dark mode, mobile, states, key cap, toast).

Merge rule: where both specify the same thing, 6-Final wins. Where 6-Final is silent, Index is used.

## Tokens

| Token | Light | Dark | Source |
|---|---|---|---|
| `--bg` | #FFFFFF | #0E0E0E | both / Index dark |
| `--text` | #111111 | #EDEDED | both / Index dark |
| `--muted` (descriptions, about, meta, labels) | #6B6B6B | #8A8A8A | 6-Final / Index dark meta |
| `--divider` | #EDEDEC | #222222 | 6-Final / Index dark |
| `--hover` | #F3F3F2 | #1A1A1A | 6-Final / Index dark |
| `--live` (status dot) | #22A55B | #34C77B | 6-Final / Index dark |
| `--underline` | #D4D4D4 | #3A3A3A | 6-Final / derived |
| `--kbd-border` | #DCDCD8 | #333333 | Index |

Fonts: Geist 400/500/600 for all text, Geist Mono 400/500 for labels, metadata and the footer.

## Desktop layout (1440px)

- Page padding is 128px top and 96px bottom. The column is 720px wide and sits 220px from the
  left edge at 1440px (implemented as `max(24px, 50vw - 500px)` so it keeps that offset from
  centre). Blocks inside the column have a 20px inset, so the text lane is 680px. Rows span the
  full 720px, so their hover background extends 20px past the text on both sides.
- Major blocks are 64px apart.
- **Header**:
  - Monogram tile is 28×28, radius 8, "n." in Geist 15/600, colours inverted.
  - "northlight" is 15/500, with a 10px gap after the tile.
  - Nav sits on the right (from Index).
- **Intro**:
  - Headline: 22/30, weight 500, letter-spacing −0.015em.
  - About: 15/24 in `--muted`.
  - "Current goal: …": 15/24 in `--text`.
  - Contact links: Geist 14/20 with a 1px underline in `--underline`, offset 4px, 18px gap.
  - The intro has 24px between groups and 12px within the text group.
- **Section**:
  - Label: Geist Mono 12/16 with 0.08em tracking, uppercase, `--muted`, padding 0 20px 8px,
    and the count on the right.
  - Rows are 4px apart.
- **Row**:
  - Padding 10px 20px, radius 10, 16px gap.
  - Left side, on one line: name (15/22, weight 500), description (15/22, `--muted`) and an
    optional metric (Mono 12).
  - Right side: "type · year" in Mono 12, no wrap.
  - In-progress rows have a 6px dot hanging in the left padding (left 6px, top 18px).
  - Rows with a link have " ↗" after the name.
  - Sunset rows have a muted name and a "SUNSET" tag in Mono 12 with 0.04em tracking.
- **Stats line**: "7 projects · 4 shipped · 1 failed · 3 in progress", Geist 14, computed from
  the data.
- **Footer**:
  - 1px top divider, padding 20px 20px 0, Mono 12/16 in `--muted`, 20px gap.
  - Items: "Updated Oct 2026", "14:32 CET" (live clock), and "Press [C] to copy email" pushed
    to the right.
  - The key cap comes from Index: 1px `--kbd-border`, radius 4, padding 1px 5px, 11/500 in
    `--text`.

## Mobile (≤ 640px): from Index-mobile-light

- 20px side padding, 56px top, 48px between blocks.
- Monogram is 30×30. Nav collapses into a 44×44 menu button with a two-line icon, which opens
  a small disclosure menu.
- H1 is 21/28.
- Rows stack: name, then description, then metric and "type · year" on their own line.
  Padding is 14px 0, no hover background, and the dot sits inline before the name.
- Footer items stack; the "Press C" hint is hidden (also hidden on any `hover: none` device).

## States: from Index-states

- Hover: row background `--hover` (only on rows that are links, and only with a fine pointer).
- Keyboard focus: 2px outline in `--text`, offset 2px, radius 10.
- Toast after pressing C: a pill at the bottom centre with background `--text`, text `--bg`,
  Mono 12, padding 8px 14px, a check icon and the text "Email copied". Announced via
  `aria-live="polite"`.

## Conflicts resolved

1. **Column width and position**: 6-Final has a 720px column 220px from the left; Index has
   620px centred. **6-Final.**
2. **Top padding**: 6-Final 128px, Index 112px. **6-Final.**
3. **Monogram**: 6-Final 28px with radius 8 and a 10px gap; Index 32px with radius 9 and a
   12px gap. **6-Final** on desktop; Index's 30px on mobile.
4. **Nav**: 6-Final has none; Index has Projects / About / Contact. **Included from Index**,
   because the brief asks for nav behaviour on mobile. It links to anchors on the page.
5. **Contact links**: 6-Final uses Geist 14, underlined, with the plain email address; Index
   uses Mono 12.5 with "Email ↗". **6-Final.**
6. **About colour and line height**: 6-Final 15/24 #6B6B6B, Index 15/25 #555555. **6-Final.**
7. **Row layout**: 6-Final puts name, description and metric on one line with padding 10/20;
   Index uses two lines (description under the name) with padding 12. **6-Final** on desktop;
   Index's stacked layout on mobile.
8. **Description size and colour**: 6-Final 15px #6B6B6B, Index 14px #555555. **6-Final.**
9. **Status dot**: 6-Final #22A55B hanging in the padding; Index #1F9D55 inline. **6-Final**
   on desktop. Inline on mobile, where there is no padding to hang it in.
10. **Year format**: 6-Final "2026–now" for in-progress projects, Index "2026". **6-Final.**
11. **Quiet Hours type**: 6-Final "Chrome extension", Index "Extension". **6-Final.**
12. **Sunset styling**: 6-Final shows a "SUNSET" mono tag; Index puts "Sunset." in the
    description. **6-Final.**
13. **Metrics** (4.8★ · 12k users, 1.2k ★, ~600 readers): only in 6-Final. **Kept**, as an
    optional `metric` field on each project.
14. **Section label**: 6-Final uses 12px with no divider and no count; Index uses 11px with a
    divider and a count. **6-Final's size, with no divider.** The count from Index is
    **included** because the brief asks for computed counts.
15. **Stats line**: 6-Final links to a /log page that is out of scope. **Rendered as plain text
    without the arrow**, computed from the data.
16. **Hover and divider colours**: 6-Final #F3F3F2 / #EDEDEC, Index #F4F4F2 / #ECECEA.
    **6-Final.**
17. **Footer time**: 6-Final "14:32 CET", Index "14:32 local time". **6-Final**: time plus the
    time-zone abbreviation, which is CET or CEST depending on the date.
18. **Footer key hint**: 6-Final uses plain text "Press C", Index has a key cap. **Index key
    cap** (a footer detail).
19. **Mobile**: there is also a 6-Final-home-mobile board. The brief points to
    Index-mobile-light for mobile, so that is followed.
