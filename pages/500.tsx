import Button from '@mui/material/Button'
import Information from 'components/Information'
import Link from 'components/Link'
import useTranslation from 'next-translate/useTranslation'

const Custom_500 = () => {
  const { t } = useTranslation('common')
  return (
    <Information
      variant="error"
      title="500"
      text={t('errors.internal-server-error')}
      actions={
        <Button component={Link} to="/">
          {t('action.goto-home')}
        </Button>
      }
    ></Information>
  )
}

export default Custom_500
