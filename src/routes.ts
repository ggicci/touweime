import { IconDefinition } from '@fortawesome/fontawesome-common-types'
import { faCog, faColumns, faHeart, faHome } from '@fortawesome/free-solid-svg-icons'
import { format, UrlObject } from 'url'

export const formatURL = format

export interface Route {
  id: string
  href: UrlObject
  icon?: IconDefinition
  children?: Route[]
}

export const HomeRoute = {
  id: 'home',
  href: { pathname: '/' },
  icon: faHome,
}

export const DashboardRoute = {
  id: 'dashboard',
  href: { pathname: '/dashboard' },
  icon: faColumns,
}

export const SupportRoute = {
  id: 'support',
  href: { pathname: '/support' },
  icon: faHeart,
}

export const SettingsRoute = {
  id: 'settings',
  href: { pathname: '/settings' },
  icon: faCog,
}

const ROUTES: readonly Route[] = [HomeRoute, DashboardRoute, SupportRoute, SettingsRoute]

export default ROUTES
