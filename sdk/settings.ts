import CryptoLatin1Encoder from 'crypto-js/enc-latin1'
import CryptoMD5 from 'crypto-js/md5'
import axios from 'lib/axios'
import { uploadWithStorageTicket } from 'lib/upload'
import { Profile } from 'sdk/users'
import useSWR from 'swr'

export type PayeeCodeKind = 'alipay' | 'wepay'
export type PaymentState = 'unprepared' | 'enabled' | 'disabled'
export type LinkState = 'unprepared' | 'alive'
export interface PayeeCode {
  id: number
  kind: PayeeCodeKind
  price_cents: number
  url?: string | null
  qr_content?: string | null
}

export interface PayeeCodeSettings {
  state: PaymentState
  codes: PayeeCode[]
}

export type AlipaySettings = PayeeCodeSettings
export type WepaySettings = PayeeCodeSettings

export interface PaymentSettings {
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

export type SettingsPatch = Partial<
  Pick<
    Settings,
    | 'bio'
    | 'about_me'
    | 'link_key'
    | 'tags'
    | 'websites'
    | 'featured_image'
    | 'featured_video'
    | 'display_supporters_count'
  >
> & {
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

  return new Promise((resolve, reject) => {
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

      try {
        await uploadWithStorageTicket(file, ticket)
        // Notify touwei server that we have uploaded the image to the cloud storage.
        await axios.patch(`/v1/settings/payee_codes/${id}`, { uploaded: true })
      } catch (error) {
        reject(error)
      }

      resolve(ticket)
    }
  })
}
