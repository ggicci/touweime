// https://swr.vercel.app/docs/global-configuration
import axios, { AxiosRequestConfig } from 'axios'

export const gaiaApi = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_GAIA_API_ENDPOINT}`,
  timeout: 5000,
  withCredentials: true,
})

gaiaApi.defaults.headers.common['X-User-Agent'] = 'axios'
if (process.env.NODE_ENV === 'development') {
  gaiaApi.defaults.headers.common['X-Service-Id'] = 'touwei'
}

type GetRequest = AxiosRequestConfig

export async function axiosFetcher<T>(url: string, params: GetRequest['params']): Promise<T> {
  const resp = await gaiaApi.get(url, { params })
  return resp.data
}
