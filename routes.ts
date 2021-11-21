import { IconDefinition } from '@fortawesome/fontawesome-common-types'
import {
  faCog,
  faColumns,
  faCompass,
  faCreditCard,
  faHeart,
  faHome,
  faQuestionCircle,
  faSignInAlt,
  faSignOutAlt,
  faUser,
} from '@fortawesome/free-solid-svg-icons'
import { format, UrlObject } from 'url'

export const formatHref = format

export interface Route {
  id: string
  href: UrlObject
  i18nKey: string
  icon?: IconDefinition
  children?: Route[]
}

export const HomeRoute = {
  id: 'home',
  href: { pathname: '/' },
  i18nKey: 'common:nav.home',
  icon: faHome,
}

export const DashboardRoute = {
  id: 'dashboard',
  href: { pathname: '/dashboard' },
  i18nKey: 'common:nav.dashboard',
  icon: faColumns,
}

export const SupportRoute = {
  id: 'support',
  href: { pathname: '/support' },
  i18nKey: 'common:nav.support',
  icon: faHeart,
}

export const SettingsRoute = {
  id: 'settings',
  href: { pathname: '/settings' },
  i18nKey: 'common:nav.settings',
  icon: faCog,
  children: [
    {
      id: 'settings.profile',
      href: { pathname: '/settings/profile' },
      i18nKey: 'settings:nav.profile',
      icon: faUser,
    },
    {
      id: 'settings.payment',
      href: { pathname: '/settings/payment' },
      i18nKey: 'settings:nav.payment',
      icon: faCreditCard,
    },
  ] as Route[],
}

export const DiscoverRoute = {
  id: 'discover',
  href: { pathname: '/discover' },
  i18nKey: 'common:nav.discover',
  icon: faCompass,
}

export const HelpRoute = {
  id: 'help',
  href: { pathname: '/help' },
  i18nKey: 'common:nav.help',
  icon: faQuestionCircle,
}

export const LoginRoute = {
  id: 'login',
  href: { pathname: '/login' },
  i18nKey: 'common:nav.login',
  icon: faSignInAlt,
}

export const LogoutRoute = {
  id: 'logout',
  href: { pathname: '/logout' },
  i18nKey: 'common:nav.logout',
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
