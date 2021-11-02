import { Container, ThemeProvider } from '@mui/material'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import React from 'react'
import Footer from 'src/components/Footer'
import Header from 'src/components/Header'
import PageContext from 'src/components/PageContext'
import ROUTES, { Route } from 'src/routes'
import theme from 'src/themes/default'
import 'styles/globals.scss'
import { SWRConfig } from 'swr'

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
    <SWRConfig>
      <PageContext.Provider value={{ activeRoute: activeRoute, routes: ROUTES }}>
        <ThemeProvider theme={theme}>
          <Header></Header>
          <Container component="main" maxWidth={false} disableGutters={true} sx={{ py: 3 }}>
            <Component {...pageProps} />
          </Container>
          <Footer></Footer>
        </ThemeProvider>
      </PageContext.Provider>
    </SWRConfig>
  )
}

export default MyApp
