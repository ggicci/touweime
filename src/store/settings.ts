interface Food {
  id: number
  name: string
  image_url: string
  price_cents: number // cents
  is_available: boolean
}

type FavoriteFoods = Food[]

interface BarcodePaymentSettings {
  id: number
  kind: string
  barcodes: { [key: number]: string } // food_id => barcode
  state: 'unprepared' | 'enabled' | 'disabled'
}

export interface AlipaySettings extends BarcodePaymentSettings {}
export interface WepaySettings extends BarcodePaymentSettings {}
export interface LinkSettings {
  key: string
  state: 'unprepared' | 'alive'
}

export interface Settings {
  id: number
  user_id: number
  favorite_foods: FavoriteFoods
  payment_methods: {
    alipay: AlipaySettings
    wepay: WepaySettings
  }
  link: LinkSettings
  tags: string[]
  google_analytics: string
}

export function useSettings() {
  //   return useRequest<Settings>({ url: `/api.proxy/gaia/v1/users/${userId}/settings` })
  return {
    data: {
      id: 1,
      user_id: 1,
      favorite_foods: [
        {
          id: 1,
          name: 'drumstick',
          image_url: 'https://touwei.ggicci.me/images/drumstick.svg',
          price_cents: 500,
          is_available: true,
        },
        {
          id: 2,
          name: 'doughnut',
          image_url: 'https://touwei.ggicci.me/images/doughnut.svg',
          price_cents: 1500,
          is_available: true,
        },
        {
          id: 3,
          name: 'coffee',
          image_url: 'https://touwei.ggicci.me/images/coffee.svg',
          price_cents: 3000,
          is_available: true,
        },
      ],
      payment_methods: {
        alipay: {
          id: 1,
          kind: 'alipay-payee-code',
          barcodes: {},
          state: 'unprepared',
        } as AlipaySettings,
        wepay: {
          id: 2,
          kind: 'wepay-payee-code',
          barcodes: {
            1: '12345678901234567890123456789015',
            2: '12345678901234567890123456789016',
            3: '12345678901234567890123456789017',
          },
          state: 'enabled',
        } as WepaySettings,
      },
      link: {
        key: 'ggicci',
        state: 'alive',
      },
    } as Settings,
  }
}
