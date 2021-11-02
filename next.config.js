/** @type {import('next').NextConfig} */
const nextTranslate = require('next-translate')

const config = {
  reactStrictMode: true,
  images: {
    domains: ['ggicci.me', 'avatars.githubusercontent.com', 'images.unsplash.com'],
  },

  experimental: {
    jscofigPaths: true,
  },
}

module.exports = nextTranslate(config)
