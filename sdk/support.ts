import axios from 'lib/axios'
import useSWR from 'swr'
import { PayeeCode, Settings } from './settings'
import { User } from './users'

export interface UserSupportPageResponse {
  user: User
  settings: Settings
}

export interface SupportIntention {
  id: number
  created_at: string
  updated_at: string
  supportee_id: number
  supporter_id: number // can be 0 (anonymous)
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
  const resp = await axios.post<unknown>(`/v1/support/${supporteeUserName}`, payload)
  // const intentionId = resp.headers['location'].split('/').pop()
  return axios.get<SupportIntention>(resp.headers['location'])
}

export function useUserSupport(username: string) {
  return useSWR<UserSupportPageResponse>(`/v1/user_pages/${username}`)
}
