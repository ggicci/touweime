import { faShareAlt } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import FontAwesomeSvgIcon from 'components/FontAwesomeSvgIcon'
import Link from 'components/Link'
import useTranslation from 'next-translate/useTranslation'
import React from 'react'
import { ProfileSettingsRoute } from 'routes'
import { useUserSupport } from 'sdk/support'
import { useLogin } from 'sdk/users'
import ShareWindow from './ShareWindow'

const Header = (props: { username: string }) => {
  const theme = useTheme()
  const { data: login } = useLogin()
  const { t } = useTranslation('common')
  const { username } = props
  const { data } = useUserSupport(username)
  const [openShareWindow, setOpenShareWindow] = React.useState(false)

  if (!data) {
    return null
  }

  const { user, settings } = data

  function canEditProfile(): boolean {
    return login?.id === user.id
  }

  const editButton = canEditProfile() ? (
    <Link to={ProfileSettingsRoute.href}>
      <Button variant="contained">{t('user-page.edit-profile')}</Button>
    </Link>
  ) : null

  return (
    <Paper elevation={0} sx={{ boxShadow: `inset 0px -1px 1px ${theme.palette.grey[300]}` }}>
      <Container>
        <Grid container sx={{ py: 4, alignItems: 'center' }}>
          <Grid item md={8} xs={12}>
            <Stack direction="row" spacing={1} sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton>
                <Avatar alt={user.username} src={user.avatar} sx={{ width: 100, height: 100 }}></Avatar>
              </IconButton>
              {/* bio */}
              <Typography variant="h3">
                <Box component="span">{user.display}</Box>
                <Box component="span" sx={{ ml: 1, fontSize: '1.5rem' }}>
                  {settings.bio}
                </Box>
              </Typography>
            </Stack>
          </Grid>
          <Grid item md={4} xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Stack direction="row" spacing={1}>
              {editButton}
              <Button
                variant="outlined"
                startIcon={<FontAwesomeSvgIcon icon={faShareAlt}></FontAwesomeSvgIcon>}
                onClick={() => setOpenShareWindow(true)}
              >
                {t('action.share')}
              </Button>

              <ShareWindow open={openShareWindow} onClose={() => setOpenShareWindow(false)}></ShareWindow>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Paper>
  )
}

export default Header
