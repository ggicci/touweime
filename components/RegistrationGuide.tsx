import { faLink } from '@fortawesome/free-solid-svg-icons'
import Button from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import FontAwesomeSvgIcon from 'components/FontAwesomeSvgIcon'
import Link from 'components/Link'
import { useSettings } from 'lib/settings'
import useTranslation from 'next-translate/useTranslation'
import React, { useEffect } from 'react'

const RegistrationGuide = () => {
  const { t } = useTranslation('common')
  const { data: settings } = useSettings()
  const [linkKey, setLinkKey] = React.useState('')

  useEffect(() => {
    if (settings) {
      setLinkKey(settings.link_key)
    }
  }, [settings])

  const registerButton = (
    <Button
      variant="contained"
      size="large"
      disableElevation
      sx={{
        borderRadius: '50px',
        fontWeight: 'bold',
      }}
      component={Link}
      to={{
        pathname: '/login',
        query: {
          return_to: `/settings/profile`,
        },
      }}
    >
      {t('home-page.make-it-alive')}
    </Button>
  )

  const activateButton = (
    <Button
      variant="contained"
      size="large"
      disableElevation
      sx={{
        borderRadius: '50px',
        fontWeight: 'bold',
      }}
      component={Link}
      to={{
        pathname: '/settings/payment',
      }}
    >
      {t('home-page.activate-my-page')}
    </Button>
  )

  const visitMyPageButton = (
    <Button
      variant="contained"
      size="large"
      disableElevation
      sx={{
        borderRadius: '50px',
        fontWeight: 'bold',
      }}
      component={Link}
      to={`/${linkKey}`}
    >
      {t('nav.visit-my-page')}
    </Button>
  )

  let actionButton = registerButton
  if (settings) {
    actionButton = settings.is_alive ? visitMyPageButton : activateButton
  }

  function handleLinkKeyChanged(event: React.ChangeEvent<HTMLInputElement>) {
    if (settings && settings.is_alive) {
      return // can't change the link key if the page is already alive
    }
    setLinkKey(event.target.value)
  }

  return (
    <TextField
      variant="outlined"
      fullWidth
      sx={{
        mt: 3,
        '& .MuiOutlinedInput-root': {
          borderRadius: '50px',
          fontSize: '1.5rem',
        },
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <FontAwesomeSvgIcon icon={faLink} />
            <Typography
              color="text.primary"
              fontSize={'1.5rem'}
              fontWeight={'bold'}
            >{`${process.env.NEXT_PUBLIC_DOMAIN}/`}</Typography>
          </InputAdornment>
        ),
        endAdornment: <InputAdornment position="end">{actionButton}</InputAdornment>,
      }}
      value={linkKey}
      onChange={handleLinkKeyChanged}
      placeholder="yourname"
    ></TextField>
  )
}

export default RegistrationGuide
