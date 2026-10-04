// Site-wide content. Placeholder identity: replace the handle and links with your own.
// Keep real names out of here if you want to stay anonymous; this feeds the <title> and OG tags.

export interface SiteLink {
  label: string;
  href: string;
}

export const site = {
  handle: "northlight",
  monogram: "n.",
  headline: "Independent developer building small, focused software.",
  about:
    "I design and build apps and tools that do one thing well. Some are shipped, some are still taking shape. Based in Europe, working on whatever I'd want to use myself.",
  currentGoal: "Current goal: ship Driftnote by December.",
  email: "hello@example.com",
  links: [
    { label: "GitHub", href: "https://github.com/northlight" },
    { label: "X", href: "https://x.com/northlight" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/northlight" },
  ] satisfies SiteLink[],
  /** Shown as "Updated Oct 2026" in the footer. */
  updated: new Date("2026-10-01"),
  /** IANA time zone for the footer clock. */
  timeZone: "Europe/Berlin",
} as const;
