import { Container, ThemeProvider } from '@mui/material'
import axios from 'axios'
import { onPageLoaded as chatwootOnPageLoaded } from 'components/Chatwoot'
import Footer from 'components/Footer'
import Header from 'components/Header'
import PageContext from 'components/PageContext'
import { axiosFetcher } from 'lib/axios'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { SnackbarProvider } from 'notistack'
import React, { useEffect } from 'react'
import RootRoute, { findActiveRoute } from 'routes'
import 'styles/globals.scss'
import { SWRConfig } from 'swr'
import theme from 'themes/default'

function onPageLoaded() {
  chatwootOnPageLoaded()
}

function swrIsSessionDependentKey(key: string) {
  const SESSIONED_KEYS = new Set(['/v1/user', '/v1/settings'])
  return SESSIONED_KEYS.has(key)
}

function swrShouldLoginOnAuthError(error: any, key: string): boolean {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401 && swrIsSessionDependentKey(key)) {
      return true
    }
  }
  return false
}

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const activeRoute = findActiveRoute(RootRoute, router.pathname)

  useEffect(() => {
    onPageLoaded()
  })

  return (
    <SWRConfig
      value={{
        fetcher: axiosFetcher,
        onErrorRetry: (error, key) => {},
        onError: (error, key) => {},
        revalidateOnFocus: false,
      }}
    >
      <PageContext.Provider value={{ activeRoute: activeRoute, rootRoute: RootRoute }}>
        <ThemeProvider theme={theme}>
          <SnackbarProvider
            //https://iamhosseindhv.com/notistack/
            maxSnack={3}
            anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
            autoHideDuration={3000}
          >
            <Header></Header>
            <Container component="main" maxWidth={false} disableGutters={true}>
              <Component {...pageProps} />
            </Container>
            <Footer></Footer>
          </SnackbarProvider>
        </ThemeProvider>
      </PageContext.Provider>
    </SWRConfig>
  )
}

export default MyApp
