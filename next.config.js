/** @type {import('next').NextConfig} */
const nextTranslate = require('next-translate')

const config = {
  reactStrictMode: true,
  images: {
    domains: [
      'touwei.ggicci.me',
      'avatars.githubusercontent.com',
      'images.unsplash.com',
      'pebble-dev.oss-cn-shanghai.aliyuncs.com',
    ],
  },

  experimental: {
    jscofigPaths: true,
  },
}

module.exports = nextTranslate(config)
