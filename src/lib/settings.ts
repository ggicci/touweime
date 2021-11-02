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
  barcodes: { [key: number]: string } // food_id => barcode
  state: 'unprepared' | 'enabled' | 'disabled'
}

export interface AlipaySettings extends BarcodePaymentSettings {}
export interface WepaySettings extends BarcodePaymentSettings {}

interface Settings {
  id: number
  user_id: number
  favorite_foods: FavoriteFoods
  payment_methods: {
    alipay: AlipaySettings
    wepay: WepaySettings
  }
  homepage_state: 'unprepared' | 'alive'
  tags: string[]
  google_analytics: string
}

export function useSettings(userId: number) {
  //   return useRequest<Settings>({ url: `/api.proxy/gaia/v1/users/${userId}/settings` })
  return {
    data: {
      id: 1,
      user_id: userId,
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
        alipay: {},
        wepay: {},
      },
    },
  }
}
