// https://swr.vercel.app/docs/global-configuration
import axios, { AxiosRequestConfig } from 'axios'

export type GetRequest = AxiosRequestConfig

async function axiosFetcher<Data>(key: string, request: GetRequest): Promise<Data> {
  if (process.env.NODE_ENV === 'development') {
    request.headers = { ...request.headers, 'X-Service-Id': 'touwei' }
  }

  console.log('axiosFetcher(debug):', key, request)

  const response = await axios.request<Data>(request)
  return response.data
}

export default axiosFetcher
