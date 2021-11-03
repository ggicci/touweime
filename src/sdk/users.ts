import useRequest from 'src/lib/useRequest'

export interface User {
  id: number
  username: string
  avatar: string
}

export function useUser() {
  return useRequest<User>({ url: '/api.proxy/gaia/v1/user' })
}
