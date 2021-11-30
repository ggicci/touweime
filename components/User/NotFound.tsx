import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
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
    <Card variant="outlined" sx={{ width: 400 }}>
      <CardHeader title={404}></CardHeader>
      <CardContent>
        <Typography>{t('user-page.not-found.title-for-anonym')}</Typography>
      </CardContent>
      <CardActions>
        <Link href={HomeRoute.href} underline="none">
          <Button>{t('user-page.not-found.goto-home')}</Button>
        </Link>
      </CardActions>
    </Card>
  )
}

const ForPageOwner = () => {
  const { t } = useTranslation('common')

  return (
    <Card variant="outlined" sx={{ width: 400 }}>
      <CardHeader title={404}></CardHeader>
      <CardContent>
        <Typography>{t('user-page.not-found.title')}</Typography>
      </CardContent>
      <CardActions>
        <Link href={PaymentSettingsRoute.href} underline="none">
          <Button>{t('user-page.not-found.goto-settings')}</Button>
        </Link>
      </CardActions>
    </Card>
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
