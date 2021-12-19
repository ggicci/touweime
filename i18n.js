module.exports = {
  // NextJS Internationalized Routing
  // https://nextjs.org/docs/advanced-features/i18n-routing
  locales: ['zh', 'en'],
  defaultLocale: 'zh',
  localeDetection: true,

  // next-translate Config
  // https://github.com/vinissimus/next-translate#3-configuration
  //
  // Namespaces of the translation files.
  //
  pages: {
    '*': ['common'],
    'rgx:^/settings': ['settings'],
  },
}
