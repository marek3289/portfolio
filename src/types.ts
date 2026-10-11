export interface SiteLink {
  label: string
  href: string
}

export type ProjectStatus = 'now' | 'shipped' | 'sunset'

export interface Project {
  name: string
  description: string
  type: string
  year: string
  status: ProjectStatus
  url?: string
  metric?: string
}
