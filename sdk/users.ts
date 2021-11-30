import useSWR from 'swr'

export interface User {
  id: number
  username: string
  avatar: string
  display: string
}

export interface Profile {
  id: number
  username: string
  display: string
  avatar: string
  bio: string
  about_me: string
  websites: string[]
  featured_image: string | null
  featured_video: string | null
  display_supporters_count: boolean
  social_sharing: {
    weibo: string
  }
  is_alive: boolean
}

export function useUser() {
  return useSWR<User>('/v1/user')
}

export function useLogin() {
  return useSWR<User>('/v1/user')
}
