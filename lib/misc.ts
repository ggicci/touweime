export function centsToYuan(price: number): number {
  return price / 100
}

export function localeRedirect(url: string, locale?: string, defaultLocale?: string) {
  if (!locale) {
    return url
  }
  return locale === defaultLocale ? url : `/${locale}${url}`
}
