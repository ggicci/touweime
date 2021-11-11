import useRequest from 'lib/useRequest'

interface Food {
  id: number
  name: string
  image_url: string
  price_cents: number // cents
  is_available: boolean
}

type FavoriteFoods = Food[]

export interface PayeeCodeProfile {
  id: number
  price_cents: number
  url?: string | null
}

export interface PayeeCodeSettings {
  kind: string
  code_ids: number[]
  codes: PayeeCodeProfile[]
  state: 'unprepared' | 'enabled' | 'disabled'
}

export type AlipaySettings = PayeeCodeSettings
export type WepaySettings = PayeeCodeSettings

export interface Settings {
  id: number
  user_id: number
  favorite_foods: FavoriteFoods
  payment: {
    alipay: AlipaySettings
    wepay: WepaySettings
  }
  link_key: string
  link_state: 'unprepared' | 'alive'
  tags: string[]
  google_analytics: string
}

export function useSettings() {
  const { data, error } = useRequest<Settings>({ url: `/api.proxy/gaia/v1/settings` })
  return {
    settings: data,
    isLoading: !error && !data,
  }
}
