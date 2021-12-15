import CryptoHmacSha256 from 'crypto-js/hmac-sha256'
import useTranslation from 'next-translate/useTranslation'
import Script from 'next/script'
import { useLogin, User } from 'sdk/users'

{
  /* Chatwoot SDK: https://www.chatwoot.com/docs/product/channels/live-chat/sdk/setup */
}

const RE_SHOULD_SHOW_CHATWOOT_ON_URL = /^(\/\w+?)?\/(about|help|privacy|terms)(\/.+?)?$/

function computeIdentifierHash(identifier: string): string {
  // FIXME(ggicci): move this to server side (get user api)
  const key = 'RFoXnABoywkdTTCPYp3x8cKF'
  return CryptoHmacSha256(identifier, key).toString()
}

function showChatwoot(show: boolean) {
  if (!window.$chatwoot) {
    return
  }
  const bubble = document.querySelector<HTMLElement>('.woot--bubble-holder')
  if (!bubble) {
    return
  }
  if (show) {
    bubble.style.removeProperty('display')
  } else {
    bubble.style.setProperty('display', 'none')
  }
}

export function onPageLoaded() {
  if (window.$chatwoot && window.$chatwoot.isOpen) {
    return
  }
  if (RE_SHOULD_SHOW_CHATWOOT_ON_URL.test(window.location.pathname)) {
    showChatwoot(true)
  } else {
    showChatwoot(false) // hide chatwoot
  }
}

const Chatwoot = () => {
  const { t } = useTranslation('common')
  const { data: login, isValidating } = useLogin()

  if (isValidating) {
    return null
  }

  return (
    <Script
      id="chatwoot"
      strategy="lazyOnload"
      src="https://app.chatwoot.com/packs/js/sdk.js"
      onLoad={() => {
        window.chatwootSettings = {
          hideMessageBubble: false,
          showPopoutButton: false,
          type: 'expanded_bubble',
          launcherTitle: t('chatwoot.launcher-title'),
        }

        window.chatwootSDK.run({
          websiteToken: '43GfBqFmwVdDtkuLgRVkLdkM',
          baseUrl: 'https://app.chatwoot.com',
        })

        function loginChatwootAs(login: User | undefined): boolean {
          if (
            !login || // not logged in
            !window.$chatwoot || // chatwoot not loaded
            !window.$chatwoot.hasLoaded
          ) {
            return false
          }

          window.$chatwoot.setUser(login.username, {
            email: login.email,
            name: login.display,
            avatar_url: login.avatar,
            identifier_hash: computeIdentifierHash(login.username),
            phone_number: '',
          })

          window.$chatwoot.setCustomAttributes({
            username: login.username,
          })

          console.debug('chatwoot: login as', login)
          return true
        }

        // Try to login chatwoot as the user, max 10 times.

        let retries = 0
        const interval = setInterval(() => {
          if (loginChatwootAs(login)) {
            clearInterval(interval)
          } else if (retries >= 10) {
            clearInterval(interval)
          } else {
            retries++
          }
        }, 1000)
      }}
    />
  )
}

export default Chatwoot
