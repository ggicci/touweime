import { faCheckCircle, faExclamationCircle, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import FontAwesomeSvgIcon from 'components/FontAwesomeSvgIcon'
import Link from 'components/Link'
import useTranslation from 'next-translate/useTranslation'
import React from 'react'
import { HomeRoute } from 'routes'

type Variant = 'success' | 'error' | 'warning' | 'info'

interface Props {
  variant?: Variant
  title: string
  text?: string
  actions?: React.ReactNode
}

const TitleIcon = ({ variant }: { variant?: Variant }) => {
  if (variant == 'success') {
    return <FontAwesomeSvgIcon icon={faCheckCircle} color="success" fontSize="large"></FontAwesomeSvgIcon>
  }
  if (variant == 'warning') {
    return <FontAwesomeSvgIcon icon={faExclamationCircle} color="warning" fontSize="large"></FontAwesomeSvgIcon>
  }
  if (variant == 'error') {
    return <FontAwesomeSvgIcon icon={faExclamationCircle} color="error" fontSize="large"></FontAwesomeSvgIcon>
  }
  if (variant == 'info') {
    return <FontAwesomeSvgIcon icon={faInfoCircle} color="info" fontSize="large"></FontAwesomeSvgIcon>
  }
  return null
}

const Information = (props: Props) => {
  const { variant, title, text, actions } = props
  const { t } = useTranslation('common')

  const defaultActions = (
    <React.Fragment>
      <Link href={HomeRoute.href} underline="none">
        <Button>{t('action.goto-home')}</Button>
      </Link>
    </React.Fragment>
  )

  const displayText = text ? (
    <Typography paragraph sx={{ pt: 3 }}>
      {text}
    </Typography>
  ) : null

  return (
    <Container sx={{ minHeight: '80vh', display: 'flex', py: 5, alignItems: 'flex-start', justifyContent: 'center' }}>
      <Card variant="outlined" sx={{ width: 450 }}>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center">
            <TitleIcon variant={variant}></TitleIcon>
            <Typography variant="h2">{title}</Typography>
          </Stack>
          {displayText}
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end' }}>{actions || defaultActions}</CardActions>
      </Card>
    </Container>
  )
}

export default Information
