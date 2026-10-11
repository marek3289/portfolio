import { contributionLevels, type ContributionCalendar, type ContributionDay, type ContributionLevel } from './types.ts'

const DAY_MS = 24 * 60 * 60 * 1000

export function parseContributionCalendar(html: string, profileUrl: string): ContributionCalendar {
  const totalText = /([\d,]+)\s+contributions\s+in the last year/.exec(html)?.[1]
  if (!totalText) throw new Error('Could not read the GitHub contribution total. The profile HTML may have changed.')

  const tips = new Map<string, string>()
  for (const match of html.matchAll(/<tool-tip\b([^>]*)>([^<]*)<\/tool-tip>/g)) {
    const id = attr(match[1], 'for')
    if (id) tips.set(id, match[2].trim())
  }

  const days: ContributionDay[] = []
  for (const match of html.matchAll(/<td\b([^>]*)>/g)) {
    const date = attr(match[1], 'data-date')
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) continue

    const id = attr(match[1], 'id')
    const title = id ? tips.get(id) : undefined
    if (!id || !title) throw new Error(`Contribution cell for ${date} is missing an id or tooltip.`)

    days.push({ date, level: levelFrom(attr(match[1], 'data-level'), date), count: countFromTooltip(title) })
  }

  if (days.length === 0) throw new Error('Could not read the GitHub contribution calendar. The profile HTML may have changed.')

  days.sort((a, b) => a.date.localeCompare(b.date))
  for (let index = 1; index < days.length; index++) {
    const previous = Date.parse(`${days[index - 1].date}T00:00:00Z`)
    const current = Date.parse(`${days[index].date}T00:00:00Z`)
    if (current === previous) throw new Error(`Duplicate contribution date: ${days[index].date}.`)
    if (current - previous !== DAY_MS) throw new Error(`Missing contribution day: ${new Date(previous + DAY_MS).toISOString().slice(0, 10)}.`)
  }

  const total = Number(totalText.replaceAll(',', ''))

  const totalLabel = new Intl.NumberFormat('en-US').format(total)

  return {
    total,
    totalLabel,
    profileUrl,
    summary: `${totalLabel} contributions in the last year`,
    from: days[0].date,
    to: days[days.length - 1].date,
    contributions: days,
  }
}

function attr(source: string, name: string): string | undefined {
  return new RegExp(`(?:^|\\s)${name}="([^"]*)"`).exec(source)?.[1]
}

function levelFrom(raw: string | undefined, date: string): ContributionLevel {
  const level = Number(raw)
  if (isContributionLevel(level) && String(level) === raw) return level

  throw new Error(`Contribution level for ${date} is ${Number(raw || undefined)}, expected 0–4.`)
}

function isContributionLevel(level: number): level is ContributionLevel {
  return contributionLevels.some((item) => item === level)
}

function countFromTooltip(text: string): number {
  if (/^No contributions?\b/i.test(text)) return 0

  const match = /^([\d,]+) contributions?\b/i.exec(text)
  if (!match) throw new Error(`Unrecognised contribution tooltip: ${text}`)

  return Number(match[1].replaceAll(',', ''))
}
