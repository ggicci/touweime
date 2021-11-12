import useSWR from 'swr'

export interface User {
  id: number
  username: string
  avatar: string
}

export function useUser() {
  return useSWR<User>('/v1/user')
}
