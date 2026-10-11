export const contributionLevels = [0, 1, 2, 3, 4] as const

export type ContributionLevel = (typeof contributionLevels)[number]

export interface ContributionDay {
  date: string
  count: number
  level: ContributionLevel
}

export interface ContributionCalendar {
  total: number
  totalLabel: string
  profileUrl: string
  summary: string
  from: string
  to: string
  contributions: ContributionDay[]
}
