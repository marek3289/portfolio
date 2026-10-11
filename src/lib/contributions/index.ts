import { createFileCache } from '../cache.ts'
import { fetchContributionCalendar } from './fetch.ts'
import type { ContributionCalendar } from './types.ts'

export type { ContributionCalendar, ContributionDay, ContributionLevel } from './types.ts'
export { fetchContributionCalendar } from './fetch.ts'
export { parseContributionCalendar } from './parse.ts'

const cache = createFileCache<ContributionCalendar>('github-contributions', fetchContributionCalendar)

export function contributionCalendar(): ContributionCalendar {
  return cache.read()
}

export function warmContributionCalendar(options?: { refresh?: boolean }): Promise<void> {
  return cache.warm(options)
}
