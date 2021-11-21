import { Container, ThemeProvider } from '@mui/material'
import Footer from 'components/Footer'
import Header from 'components/Header'
import PageContext from 'components/PageContext'
import { axiosFetcher } from 'lib/axios'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { SnackbarProvider } from 'notistack'
import React from 'react'
import ROUTES, { Route } from 'routes'
import 'styles/globals.scss'
import { SWRConfig } from 'swr'
import theme from 'themes/default'

/**
 *
 * @param routes All the routes defined in the app
 * @param pathname The current pathname
 * @returns The active route or null.
 * @reference https://github.com/mui-org/material-ui/blob/master/docs/pages/_app.js#L282
 */
function findActiveRoute(routes: readonly Route[], pathname: string): Route | null {
  const activeRoute = routes.find((route) => {
    if (route.children) {
      if (pathname.indexOf(`${route.href.pathname}/`) === 0) {
        return findActiveRoute(route.children, pathname)
      }
    }
    // Should be an exact match if no children.
    return pathname === route.href.pathname
  })

  if (!activeRoute) {
    return null
  }

  // We need to drill down.
  if (activeRoute.children) {
    return findActiveRoute(activeRoute.children, pathname)
  }

  return activeRoute
}

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const activeRoute = findActiveRoute(ROUTES, router.pathname)

  return (
    <SWRConfig
      value={{
        fetcher: axiosFetcher,
        onError: (error, key) => {},
        revalidateOnFocus: false,
      }}
    >
      <PageContext.Provider value={{ activeRoute: activeRoute, routes: ROUTES }}>
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
