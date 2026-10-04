export type ProjectStatus = "now" | "shipped" | "sunset";

export interface Project {
  name: string;
  description: string;
  /** Platform or kind, e.g. "iOS", "Web", "Open source". */
  type: string;
  /** Display year, e.g. "2025" or "2025–now" for ongoing work. */
  year: string;
  status: ProjectStatus;
  /** Live link. Rows with a url render as links with a ↗ marker; sunset rows never link. */
  url?: string;
  /** One honest number shown next to the description, e.g. "12k users". */
  metric?: string;
}

// Order here is the order on the page. Placeholder URLs: swap in real ones.
export const projects: Project[] = [
  {
    name: "Driftnote",
    description: "A calm journaling app with no streaks or nagging.",
    type: "iOS",
    year: "2026–now",
    status: "now",
  },
  {
    name: "Tally",
    description: "Invoicing and time tracking for solo freelancers.",
    type: "Web",
    year: "2026–now",
    status: "now",
  },
  {
    name: "Quiet Hours",
    description: "Batches notifications into two daily digests.",
    type: "Chrome extension",
    year: "2025–now",
    status: "now",
  },
  {
    name: "Pocketlist",
    description: "Shared grocery lists that sync instantly.",
    type: "iOS",
    year: "2025",
    status: "shipped",
    url: "https://example.com/pocketlist",
    metric: "4.8★ · 12k users",
  },
  {
    name: "Fieldkit",
    description: "Open-source form backend for static sites.",
    type: "Open source",
    year: "2024",
    status: "shipped",
    url: "https://github.com/northlight/fieldkit",
    metric: "1.2k ★",
  },
  {
    name: "Weekly",
    description: "Turns saved links into a Sunday reading digest.",
    type: "Web",
    year: "2024",
    status: "shipped",
    url: "https://example.com/weekly",
    metric: "~600 readers",
  },
  {
    name: "Linkpile",
    description: "Visual bookmark manager.",
    type: "Web",
    year: "2023",
    status: "sunset",
  },
];

export const nowProjects = projects.filter((p) => p.status === "now");
// Sunset projects launched too, so they stay in the shipped section.
export const shippedProjects = projects.filter((p) => p.status !== "now");

export const stats = {
  total: projects.length,
  shipped: shippedProjects.length,
  failed: projects.filter((p) => p.status === "sunset").length,
  inProgress: nowProjects.length,
};
