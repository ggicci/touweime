// Copy from: https://github.com/mui-org/material-ui/blob/master/docs/src/modules/components/Link.tsx

import MuiLink, { LinkProps as MuiLinkProps } from '@mui/material/Link'
import { styled } from '@mui/material/styles'
import clsx from 'clsx'
import NextLink, { LinkProps as NextLinkProps } from 'next/link'
import Router, { useRouter } from 'next/router'
import React from 'react'
import { format } from 'url'

// Add support for the sx prop for consistency with the other branches.
const Anchor = styled('a')({})

type Url = NextLinkProps['href']

function reloadPage() {
  Router.reload()
}

interface NextLinkComposedProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>,
    Omit<NextLinkProps, 'href' | 'as' | 'passHref'> {
  to: Url
}

const NextLinkComposed = React.forwardRef<HTMLAnchorElement, NextLinkComposedProps>(function NextLinkComposed(
  props,
  ref,
) {
  const { to, replace, scroll, shallow, prefetch, locale, ...other } = props

  return (
    <NextLink
      href={to}
      prefetch={prefetch}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      passHref
      locale={locale}
    >
      <Anchor ref={ref} {...other} />
    </NextLink>
  )
})

export type LinkProps = {
  activeClassName?: string
  to: Url
  noLinkStyle?: boolean
  forceReload?: boolean
} & Omit<NextLinkComposedProps, 'to' | 'linkAs' | 'href'> &
  Omit<MuiLinkProps, 'href'>

function isExternalLink(href: Url | string): boolean {
  return typeof href === 'string' && (href.indexOf('http') === 0 || href.indexOf('mailto:') === 0)
}

// A styled version of the Next.js Link component:
// https://nextjs.org/docs/#with-link
const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(props, ref) {
  const {
    activeClassName = 'active',
    className: classNameProps,
    to,
    noLinkStyle,
    role, // Link don't have roles.
    forceReload,
    ...other
  } = props

  const router = useRouter()
  const pathname = typeof to === 'string' ? to : to.pathname
  const className = clsx(classNameProps, {
    [activeClassName]: router.pathname === pathname && activeClassName,
  })

  const strUrl = typeof to === 'string' ? to : format(to)

  if (isExternalLink(to)) {
    if (noLinkStyle) {
      return <Anchor className={className} href={strUrl} ref={ref} {...other} />
    }

    return <MuiLink className={className} href={strUrl} ref={ref} {...other} />
  }

  if (noLinkStyle) {
    return <NextLinkComposed className={className} ref={ref} to={to} {...other} />
  }

  return <MuiLink component={NextLinkComposed} className={className} ref={ref} to={to} {...other} />
})

export default Link
