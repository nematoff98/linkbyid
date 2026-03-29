export interface DashboardLink {
  id: number
  code: string
  title: string
  description: string
  image: string
  url: string
  clicks: number
  createdAt: string
}

export interface ProfileSettings {
  username: string
  bio: string
  avatar: string
}
