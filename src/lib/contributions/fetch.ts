import { site } from '../../site.ts'
import { parseContributionCalendar } from './parse.ts'
import type { ContributionCalendar } from './types.ts'

export async function fetchContributionCalendar(): Promise<ContributionCalendar> {
  const github = site.links.find((link) => link.label === 'GitHub')
  if (!github) throw new Error('Add a GitHub link to site data before rendering the contribution graph.')

  const login = new URL(github.href).pathname.split('/').filter(Boolean)[0]
  if (!login) throw new Error(`GitHub link ${github.href} has no username.`)

  const response = await fetch(`https://github.com/users/${login}/contributions`, {
    signal: AbortSignal.timeout(12_000),
    headers: {
      Accept: 'text/html',
      'User-Agent': 'portfolio (github contribution graph)',
    },
  })

  if (!response.ok) throw new Error(`GitHub contributions request failed (${response.status}).`)

  return parseContributionCalendar(await response.text(), github.href)
}
