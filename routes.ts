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

export const ProfileSettingsRoute = {
  id: 'settings.profile',
  href: { pathname: '/settings/profile' },
  i18nKey: 'settings:nav.profile',
  icon: faUser,
}

export const PaymentSettingsRoute = {
  id: 'settings.payment',
  href: { pathname: '/settings/payment' },
  i18nKey: 'settings:nav.payment',
  icon: faCreditCard,
}

export const SettingsRoute = {
  id: 'settings',
  href: { pathname: '/settings' },
  i18nKey: 'common:nav.settings',
  icon: faCog,
  children: [ProfileSettingsRoute, PaymentSettingsRoute] as Route[],
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

export const HomeRoute = {
  id: 'home',
  href: { pathname: '/' },
  i18nKey: 'common:nav.home',
  icon: faHome,
  children: [SettingsRoute, DiscoverRoute, SupportRoute, DashboardRoute, LoginRoute, LogoutRoute, HelpRoute],
}

export const RootRoute = HomeRoute

/**
 * Find the active route according to the current URL.
 * @param root The root route defined for the app.
 * @param pathname The current pathname.
 * @returns The active (longest match) route or null.
 */
export function findActiveRoute(root: Route, pathname: string): Route | null {
  function isActive(route: Route, pathname: string): boolean {
    const slashedPathname = route.href.pathname?.endsWith('/') ? route.href.pathname : `${route.href.pathname}/`
    return pathname === route.href.pathname || pathname.indexOf(slashedPathname) === 0
  }

  const queue: [Route, number][] = [[root, 0]]
  // const activeRoutes: [Route, number][] = []
  let active: [Route | null, number] = [null, -1]

  while (true) {
    const item = queue.shift()
    if (!item) {
      // empty queue
      break
    }
    const [route, depth] = item
    if (!isActive(route, pathname)) {
      continue
    }
    // activeRoutes.push(item)
    if (depth > active[1]) {
      active = [route, depth]
    }
    for (const child of route.children || []) {
      queue.push([child, depth + 1])
    }
  }

  // return activeRoutes.length > 0 ? activeRoutes[activeRoutes.length - 1][0] : null
  return active[0]
}

export default RootRoute
