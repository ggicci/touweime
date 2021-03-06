import { gaiaApi } from 'lib/axios'
import useSWR from 'swr'
import { PayeeCode, Settings } from './settings'
import { User } from './users'

export interface UserSupportPageResponse {
  user: User
  settings: Settings
}

export interface Food {
  id: string
  price_cents: number
  title: string
  image_url: string
}

export const ALL_FOODS: readonly Food[] = [
  { id: 'fried-egg', price_cents: 100, title: 'Fried Egg', image_url: '/images/fried-egg.svg' },
  { id: 'popsicle', price_cents: 500, title: 'Popsicle', image_url: '/images/popsicle.svg' },
  { id: 'chips', price_cents: 1000, title: 'Chips', image_url: '/images/chips.svg' },
  { id: 'doughnut', price_cents: 3000, title: 'Doughnut', image_url: '/images/doughnut.svg' },
  { id: 'pizza', price_cents: 5000, title: 'Pizza', image_url: '/images/pizza.svg' },
  { id: 'lobster', price_cents: 10000, title: 'Lobster', image_url: '/images/lobster.svg' },
]

export function useFoods() {
  return ALL_FOODS
}

export function getFoodById(id: string): Food {
  return ALL_FOODS.find((food) => food.id === id)!
}

export interface SupportIntention {
  id: number
  created_at: string
  updated_at: string
  uuid: string
  supportee_id: number
  supporter_id: number // can be 0 (anonymous)
  supportee: User
  supporter: User | null
  food_id: string
  price_cents: number
  message: string
  is_private: boolean
  payment: {
    can_pay: boolean
    alipay_payee_code_id: number
    wepay_payee_code_id: number
    alipay_payee_code?: PayeeCode
    wepay_payee_code?: PayeeCode
  }
  supportee_confirmed_at: string | null
  supporter_confirmed_at: string | null
  sys_confirmed_at: string | null
}

export type SupportIntentionCreationPayload = Pick<
  SupportIntention,
  'food_id' | 'price_cents' | 'message' | 'is_private'
>

export async function createSupportIntention(supporteeUserName: string, payload: SupportIntentionCreationPayload) {
  const resp = await gaiaApi.post<unknown>(`/v1/support/${supporteeUserName}`, payload)
  // const intentionId = resp.headers['location'].split('/').pop()
  return gaiaApi.get<SupportIntention>(resp.headers['location'])
}

export type SupportIntentionUpdatePayload = {
  confirmed?: boolean
}

export async function patchSupportIntention(intentionUUID: string, payload: SupportIntentionUpdatePayload) {
  return await gaiaApi.patch<unknown>(`/v1/support_intentions/${intentionUUID}`, payload)
}

export function useUserSupport(username: string) {
  return useSWR<UserSupportPageResponse>(`/v1/user_pages/${username}`)
}
