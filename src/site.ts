import type { Project } from './types.ts'

export const site = {
  handle: 'marquee.io',
  monogram: 'm.',
  headline: 'Independent developer building small, focused software.',
  about: 'I design and build apps and tools that do one thing well. Some are shipped, some are still taking shape. Based in Poland, working on whatever I\'d want to use myself.',
  email: 'marek2494@o2.pl',
  links: [
    { label: 'GitHub', href: 'https://github.com/marek3289' },
    { label: 'X', href: 'https://x.com/marqueeio' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/marek3289' },
  ],
  updated: new Date('2026-10-11'),
  timeZone: 'Europe/Warsaw',
} as const

export const projects: Project[] = [
  {
    name: 'TwójMentor.IT',
    description: 'A Polish community to find an IT mentor, book a session, and chat.',
    type: 'Web',
    year: '2024–now',
    status: 'now',
    url: 'https://twojmentor.it/',
  },
  {
    name: 'Driftnote',
    description: 'A calm journaling app with no streaks or nagging.',
    type: 'iOS',
    year: '2026–now',
    status: 'now',
  },
  {
    name: 'Tally',
    description: 'Invoicing and time tracking for solo freelancers.',
    type: 'Web',
    year: '2026–now',
    status: 'now',
  },
  {
    name: 'Quiet Hours',
    description: 'Batches notifications into two daily digests.',
    type: 'Chrome extension',
    year: '2025–now',
    status: 'now',
  },
  {
    name: 'Pocketlist',
    description: 'Shared grocery lists that sync instantly.',
    type: 'iOS',
    year: '2025',
    status: 'shipped',
    url: 'https://example.com/pocketlist',
    metric: '4.8★ · 12k users',
  },
  {
    name: 'Fieldkit',
    description: 'Open-source form backend for static sites.',
    type: 'Open source',
    year: '2024',
    status: 'shipped',
    url: 'https://github.com/marek3289/fieldkit',
    metric: '1.2k ★',
  },
  {
    name: 'Weekly',
    description: 'Turns saved links into a Sunday reading digest.',
    type: 'Web',
    year: '2024',
    status: 'shipped',
    url: 'https://example.com/weekly',
    metric: '~600 readers',
  },
  {
    name: 'Linkpile',
    description: 'Visual bookmark manager.',
    type: 'Web',
    year: '2023',
    status: 'sunset',
  },
]

export const nowProjects = projects.filter((p) => p.status === 'now')
export const shippedProjects = projects.filter((p) => p.status !== 'now')

export const stats = {
  total: projects.length,
  shipped: shippedProjects.length,
  failed: projects.filter((p) => p.status === 'sunset').length,
  inProgress: nowProjects.length,
}
