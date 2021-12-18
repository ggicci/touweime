import Button from '@mui/material/Button'
import Information from 'components/Information'
import Link from 'components/Link'
import { useLogin } from 'lib/users'
import useTranslation from 'next-translate/useTranslation'
import React from 'react'
import { HomeRoute, PaymentSettingsRoute } from 'routes'
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
        <Link to={HomeRoute.href} underline="none">
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
        <Link to={PaymentSettingsRoute.href} underline="none">
          <Button>{t('user-page.not-found.goto-settings')}</Button>
        </Link>
      }
    ></Information>
  )
}

const UserNotFound = (props: Props) => {
  const { data: login } = useLogin()

  if (login?.username === props.username) {
    return <ForPageOwner></ForPageOwner>
  }
  return <ForAnonym></ForAnonym>
}

export default UserNotFound
