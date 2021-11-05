import { IconDefinition } from '@fortawesome/fontawesome-common-types'
import {
  faCog,
  faColumns,
  faCompass,
  faHeart,
  faHome,
  faQuestionCircle,
  faSignInAlt,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons'
import { format, UrlObject } from 'url'

export const formatHref = format

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

export const DiscoverRoute = {
  id: 'discover',
  href: { pathname: '/discover' },
  icon: faCompass,
}

export const HelpRoute = {
  id: 'help',
  href: { pathname: '/help' },
  icon: faQuestionCircle,
}

export const LoginRoute = {
  id: 'login',
  href: { pathname: '/login' },
  icon: faSignInAlt,
}

export const LogoutRoute = {
  id: 'logout',
  href: { pathname: '/logout' },
  icon: faSignOutAlt,
}

const ROUTES: readonly Route[] = [
  HomeRoute,
  DiscoverRoute,
  DashboardRoute,
  SupportRoute,
  SettingsRoute,
  HelpRoute,
  LoginRoute,
  LogoutRoute,
]

export default ROUTES
