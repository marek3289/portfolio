export interface SiteLink {
  label: string;
  href: string;
}

export const site = {
  handle: "marquee.io",
  monogram: "m.",
  headline: "Independent developer building small, focused software.",
  about: "I design and build apps and tools that do one thing well. Some are shipped, some are still taking shape. Based in Poland, working on whatever I'd want to use myself.",
  email: "marek2494@o2.pl",
  links: [
    { label: "GitHub", href: "https://github.com/marek3289" },
    { label: "X", href: "https://x.com/marqueeio" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/marek3289" },
  ],
  updated: new Date("2026-10-04"),
  timeZone: "Europe/Warsaw",
} as const;
