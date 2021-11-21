import { GetServerSideProps } from 'next'
import { formatHref, SettingsRoute } from 'routes'

const Settings = () => {
  return null
}

Settings.className = 'Settings'

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      permanent: false,
      destination: formatHref(SettingsRoute.children[0].href),
    },
  }
}

export default Settings
