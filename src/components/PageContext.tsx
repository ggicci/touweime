import * as React from 'react'
import ROUTES, { Route } from 'src/routes'

export interface PageContextValue {
  activeRoute: Route | null
  routes: readonly Route[]
}

const PageContext = React.createContext<PageContextValue>({
  activeRoute: null,
  routes: ROUTES,
})

if (process.env.NODE_ENV !== 'production') {
  PageContext.displayName = 'PageContext'
}

export default PageContext
