import * as React from 'react'
import { RootRoute, Route } from 'routes'

export interface PageContextValue {
  activeRoute: Route | null
  rootRoute: Route
}

const PageContext = React.createContext<PageContextValue>({
  activeRoute: null,
  rootRoute: RootRoute,
})

if (process.env.NODE_ENV !== 'production') {
  PageContext.displayName = 'PageContext'
}

export default PageContext
