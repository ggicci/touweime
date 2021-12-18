import useSWR from 'swr'

export interface Photo {
  id: string
  width: number
  height: number
  color: string
  urls: { [key: string]: string }
  user: {
    id: string
    username: string
    name: string
    profile_image: {
      small: string
      medium: string
      large: string
    }
  }
}

export function useRandomPhoto() {
  return useSWR<Photo>('/v1/unsplash/random')
}
