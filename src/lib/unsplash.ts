import axios from 'axios'

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

const API_ENDPOINT = process.env.UNSPLASH_API_ENDPOINT
const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY
const COLLECTION_ID = process.env.UNSPLASH_COLLECTION_ID

export async function getRandomPhoto(): Promise<Photo | null> {
  try {
    // FIXME(ggicci): use self api to get a random photo
    // const resp = await axios.get<Photo[]>(`${API_ENDPOINT!}/photos/random`, {
    //   headers: {
    //     'Accept-Version': 'v1',
    //     Authorization: `Client-ID ${ACCESS_KEY}`,
    //   },
    //   params: {
    //     collections: COLLECTION_ID,
    //     count: 1,
    //   },
    // })
    // return resp.data[0]

    return {
      id: '30kISztIV8w',
      width: 4000,
      height: 2667,
      color: '#40260c',
      urls: {
        raw: 'https://images.unsplash.com/photo-1597851065532-055f97d12e47?ixid=MnwxMzQxOTZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MzU2Njc2MzI&ixlib=rb-1.2.1',
        full: 'https://images.unsplash.com/photo-1597851065532-055f97d12e47?crop=entropy&cs=srgb&fm=jpg&ixid=MnwxMzQxOTZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MzU2Njc2MzI&ixlib=rb-1.2.1&q=85',
        regular:
          'https://images.unsplash.com/photo-1597851065532-055f97d12e47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMzQxOTZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MzU2Njc2MzI&ixlib=rb-1.2.1&q=80&w=1080',
        small:
          'https://images.unsplash.com/photo-1597851065532-055f97d12e47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMzQxOTZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MzU2Njc2MzI&ixlib=rb-1.2.1&q=80&w=400',
        thumb:
          'https://images.unsplash.com/photo-1597851065532-055f97d12e47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMzQxOTZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MzU2Njc2MzI&ixlib=rb-1.2.1&q=80&w=200',
      },
      user: {
        id: '_X4qTyQdFqw',
        username: 'markuswinkler',
        name: 'Markus Winkler',
        profile_image: {
          small:
            'https://images.unsplash.com/profile-1562947793246-6f1ccf9383cf?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=32&w=32',
          medium:
            'https://images.unsplash.com/profile-1562947793246-6f1ccf9383cf?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=64&w=64',
          large:
            'https://images.unsplash.com/profile-1562947793246-6f1ccf9383cf?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=128&w=128',
        },
      },
    }
  } catch (err) {
    console.error(err)
    if (!axios.isAxiosError(err)) {
      throw err
    }
    return null
  }
}
