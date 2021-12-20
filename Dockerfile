# Reference: https://nextjs.org/docs/deployment

FROM node:16-alpine3.14 AS deps

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile


FROM node:16-alpine3.14 AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN yarn build && yarn install --production --ignore-scripts --prefer-offline

# Production image, copy all the files and run next
FROM node:16-alpine3.14 AS runner


# 1. DO NOT remove these ARGs and LABELs
# 2. Edit contents wrapped by '<>' to make your docker images better than 90% of existing ones
ARG web_touwei_me_image_created
ARG web_touwei_me_image_version
ARG web_touwei_me_image_revision
LABEL \
    web.touwei.me.image.created="${web_touwei_me_image_created}" \
    web.touwei.me.image.version="${web_touwei_me_image_version}" \
    web.touwei.me.image.revision="${web_touwei_me_image_revision}" \
    web.touwei.me.image.authors="Ggicci <ggicci.t@gmail.com>" \
    web.touwei.me.image.url="https://console.cloud.google.com/gcr/images/ggicci/ASIA/touweime-web" \
    web.touwei.me.image.documentation="https://github.com/ggicci/touweime" \
    web.touwei.me.image.source="https://github.com/ggicci/touweime" \
    web.touwei.me.image.vendor="GGICCI" \
    web.touwei.me.image.licenses="COMMERCIAL" \
    web.touwei.me.image.title="Website of touwei.me" \
    web.touwei.me.image.description="Make sharing and supporting a positive circle"

WORKDIR /app

ENV NODE_ENV production


# https://github.com/vercel/next.js/issues/18412#issuecomment-751272319
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/i18n.js ./i18n.js
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
ENV PORT 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
ENV NEXT_TELEMETRY_DISABLED 1

CMD ["node_modules/.bin/next", "start"]
