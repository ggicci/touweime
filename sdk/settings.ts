import CryptoLatin1Encoder from 'crypto-js/enc-latin1'
import CryptoMD5 from 'crypto-js/md5'
import axios from 'lib/axios'
import { uploadWithStorageTicket } from 'lib/upload'
import { Profile } from 'sdk/users'
import useSWR from 'swr'

export interface PayeeCode {
  id: number
  price_cents: number
  url?: string | null
}

export type PaymentState = 'unprepared' | 'enabled' | 'disabled'
export type LinkState = 'unprepared' | 'alive'

export interface PayeeCodeSettings {
  state: PaymentState
  codes: PayeeCode[]
}

export type AlipaySettings = PayeeCodeSettings
export type WepaySettings = PayeeCodeSettings

interface PaymentSettings {
  payment: {
    alipay: AlipaySettings
    wepay: WepaySettings
  }
}

export interface Settings extends Profile, PaymentSettings {
  id: number
  user_id: number
  link_key: string
  link_state: LinkState
  tags: string[]
  google_analytics: string
}

export function useSettings() {
  return useSWR<Settings>('/v1/settings')
}

export type SettingsPatch = Partial<Settings> & {
  payment?: {
    alipay?: Pick<AlipaySettings, 'state'>
    wepay?: Pick<WepaySettings, 'state'>
  }
}

export async function updateSettings(patch: SettingsPatch) {
  await axios.patch(`/v1/settings`, patch)
}

export async function uploadPayeeCodeImage(id: number, file: File) {
  const reader = new FileReader()
  reader.readAsBinaryString(file)

  return new Promise((resolve) => {
    reader.onloadend = async (e) => {
      const imageData = e.target!.result as string
      const imageHash = CryptoMD5(CryptoLatin1Encoder.parse(imageData))
      const hexMD5 = imageHash.toString()
      const resp = await axios.get(`/v1/settings/payee_codes/${id}/upload_ticket`, {
        params: {
          md5: hexMD5,
          content_type: file.type,
          filename: file.name,
        },
      })
      const ticket = resp.data
      await uploadWithStorageTicket(file, ticket)

      // Notify touwei server that we have uploaded the image to the cloud storage.
      await axios.patch(`/v1/settings/payee_codes/${id}`, { uploaded: true })
      resolve(ticket)
    }
  })
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
