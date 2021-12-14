import axios from 'axios'
import Information from 'components/Information'
import { gaiaApi } from 'lib/axios'
import { GetServerSideProps } from 'next'
import useTranslation from 'next-translate/useTranslation'
import { useEffect } from 'react'
import { useSWRConfig } from 'swr'

interface LogoutProps {
  error: string | null
}

const Logout = (props: LogoutProps) => {
  const { t } = useTranslation('common')
  const { error } = props
  const { mutate } = useSWRConfig()

  useEffect(() => {
    if (!error && window.$chatwoot) {
      window.$chatwoot.reset()
    }

    mutate('/v1/user', null)
  })

  const title = error ? t('message.logout-failed') : t('message.logged-out')

  return <Information variant="success" title={title}></Information>
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const cookies = req.headers.cookie || ''

  let logoutError = null
  try {
    await gaiaApi.post<unknown>('/v1/logout', undefined, {
      headers: {
        Cookie: cookies,
      },
    })
  } catch (err) {
    logoutError = String(err)
    if (axios.isAxiosError(err) && err.response?.status === 401) {
      logoutError = null
    }
  }

  // if (logoutError === null) {
  //   return {
  //     redirect: {
  //       permanent: false,
  //       destination: '/',
  //     },
  //   }
  // }

  return { props: { error: logoutError } }
}

export default Logout
