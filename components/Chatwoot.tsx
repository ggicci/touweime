import CryptoHmacSha256 from 'crypto-js/hmac-sha256'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import Script from 'next/script'
import { useLogin, User } from 'sdk/users'

const RE_SHOULD_SHOW_CHATWOOT_ON_URL = /^(\/\w+?)?\/(help|privacy|terms)(\/.+?)?$/

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
  console.info('chatwoot::onPageLoaded')
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
  const router = useRouter()
  const { data: login, isValidating } = useLogin()

  if (isValidating) {
    return null
  }

  {
    /* Chatwoot SDK: https://www.chatwoot.com/docs/product/channels/live-chat/sdk/setup */
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

          return true
        }

        if (!loginChatwootAs(login)) {
          setTimeout(() => {
            loginChatwootAs(login)
          }, 3000)
        }
      }}
    ></Script>
  )
}

export default Chatwoot
