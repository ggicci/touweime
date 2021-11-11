// https://github.com/vercel/swr/blob/master/examples/axios-typescript/libs/useRequest.ts
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import useSWR, { SWRConfiguration, SWRResponse } from 'swr'

export type GetRequest = AxiosRequestConfig

interface Return<Data, Error>
  extends Pick<SWRResponse<AxiosResponse<Data>, AxiosError<Error>>, 'isValidating' | 'error' | 'mutate'> {
  data: Data | undefined
  response: AxiosResponse<Data> | undefined
}

export interface Config<Data = unknown, Error = unknown>
  extends Omit<SWRConfiguration<AxiosResponse<Data>, AxiosError<Error>>, 'fallbackData'> {
  fallbackData?: Data
}

export default function useRequest<Data = unknown, Error = unknown>(
  request: GetRequest,
  { fallbackData, ...config }: Config<Data, Error> = {},
): Return<Data, Error> {
  // Add default configs to request.
  if (process.env.NODE_ENV === 'development') {
    request.headers = { ...request.headers, 'X-Service-Id': 'touwei' }
  }

  const cacheKey = JSON.stringify(request)
  // console.log('cacheKey:', cacheKey)
  const {
    data: response,
    error,
    isValidating,
    mutate,
  } = useSWR<AxiosResponse<Data>, AxiosError<Error>>(
    cacheKey,
    /**
     * NOTE: Typescript thinks `request` can be `null` here, but the fetcher
     * function is actually only called by `useSWR` when it isn't.
     */
    () => axios.request<Data>(request),
    {
      ...config,
      fallbackData: fallbackData && {
        status: 200,
        statusText: 'InitialData',
        config: request!,
        headers: {},
        data: fallbackData,
      },
    },
  )

  return {
    data: response && response.data,
    response,
    error,
    isValidating,
    mutate,
  }
}
