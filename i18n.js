module.exports = {
  // NextJS Internationalized Routing
  // https://nextjs.org/docs/advanced-features/i18n-routing
  locales: ['en', 'zh'],
  defaultLocale: 'zh',
  domains: [
    {
      domain: 'touwei.ggicci.me',
      defaultLocale: 'zh',
      locales: ['zh'],
    },
  ],

  // next-translate Config
  // https://github.com/vinissimus/next-translate#3-configuration
  //
  // Namespaces of the translation files.
  //
  pages: {
    '*': ['common'],
    // 'rgx:^/settings': ['settings'],
  },
}
