import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Information from 'components/Information'
import Link from 'components/Link'
import useTranslation from 'next-translate/useTranslation'
import { HomeRoute, PaymentSettingsRoute } from 'routes'
import { useLogin } from 'sdk/users'

interface Props {
  username: string
}

const ForAnonym = () => {
  const { t } = useTranslation('common')

  return (
    <Information
      variant="info"
      title="404"
      text={t('user-page.not-found.title-for-anonym')}
      actions={
        <Link href={HomeRoute.href} underline="none">
          <Button>{t('user-page.not-found.goto-home')}</Button>
        </Link>
      }
    ></Information>
  )
}

const ForPageOwner = () => {
  const { t } = useTranslation('common')

  return (
    <Information
      variant="warning"
      title="404"
      text={t('user-page.not-found.title')}
      actions={
        <Link href={PaymentSettingsRoute.href} underline="none">
          <Button>{t('user-page.not-found.goto-settings')}</Button>
        </Link>
      }
    ></Information>
  )
}

const UserNotFound = (props: Props) => {
  const { data: login } = useLogin()
  const Display = login?.username === props.username ? ForPageOwner : ForAnonym

  return (
    <Container sx={{ py: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Display />
    </Container>
  )
}

export default UserNotFound
