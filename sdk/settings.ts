import CryptoLatin1Encoder from 'crypto-js/enc-latin1'
import CryptoMD5 from 'crypto-js/md5'
import axios from 'lib/axios'
import { uploadWithStorageTicket } from 'lib/upload'
import useSWR from 'swr'

interface Food {
  id: number
  name: string
  image_url: string
  price_cents: number // cents
  is_available: boolean
}

type FavoriteFoods = Food[]

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

export interface Settings {
  id: number
  user_id: number
  favorite_foods: FavoriteFoods
  payment: {
    alipay: AlipaySettings
    wepay: WepaySettings
  }
  link_key: string
  link_state: LinkState
  tags: string[]
  google_analytics: string
}

export function useSettings() {
  return useSWR<Settings>('/v1/settings')
}

type SettingsPatch = Pick<Settings, 'link_key' | 'tags'> & {
  payment?: {
    alipay?: Pick<AlipaySettings, 'state'>
    wepay?: Pick<WepaySettings, 'state'>
  }
}

export async function updateSettings(patch: SettingsPatch) {
  await axios.patch(`/v1/settings`, {
    payment: patch.payment,
    link_key: patch.link_key,
    tags: patch.tags,
  })
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
