import { localeRedirect } from 'lib/misc'
import { GetServerSideProps } from 'next'

const Settings = () => {
  return null
}

Settings.className = 'Settings'

export const getServerSideProps: GetServerSideProps = async ({ locale, defaultLocale }) => {
  return {
    redirect: {
      permanent: false,
      destination: localeRedirect('/settings/profile', locale, defaultLocale),
    },
  }
}

export default Settings
