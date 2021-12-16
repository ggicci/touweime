import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import FontAwesomeSvgIcon from 'components/FontAwesomeSvgIcon'
import Link from 'components/Link'
import useTranslation from 'next-translate/useTranslation'
import React from 'react'
import { HelpRoute, LoginRoute, LogoutRoute, Route, SettingsRoute } from 'routes'
import { useLogin, User } from 'sdk/users'

function LoginButton() {
  const { t } = useTranslation('common')

  return (
    <Button
      color="inherit"
      component={Link}
      to={LoginRoute.href}
      startIcon={<FontAwesomeSvgIcon icon={LoginRoute.icon!}></FontAwesomeSvgIcon>}
    >
      {t(LoginRoute.i18nKey)}
    </Button>
  )
}

interface AvatarWithMenuProps {
  user: User
}

const AvatarWithMenu = (props: AvatarWithMenuProps) => {
  const { t } = useTranslation('common')
  const { user } = props

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  interface MenuItem extends Route {
    label?: string
    isDivider?: boolean
  }

  const myItems: MenuItem[] = [
    { ...SettingsRoute, label: t(SettingsRoute.i18nKey) },
    { ...HelpRoute, label: t(HelpRoute.i18nKey) },
    { id: 'divider-1', href: {}, i18nKey: '', isDivider: true },
    { ...LogoutRoute, label: t(LogoutRoute.i18nKey) },
  ]

  return (
    <React.Fragment>
      <IconButton onClick={handleClick} size="small" sx={{ ml: 2 }}>
        <Avatar sx={{ width: 32, height: 32 }} src={user.avatar} alt={user.username}>
          {user.display[0]}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* display login info */}
        <Card sx={{ boxShadow: 0, minWidth: 220 }}>
          <CardContent>
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
              <Avatar sx={{ width: 48, height: 48 }} src={user.avatar} alt={user.username}>
                {user.display[0]}
              </Avatar>
              <Typography variant="h6">{user.display}</Typography>
            </Stack>
          </CardContent>
        </Card>

        {/* FIXME(ggicci): use a route with path parameter? */}
        <MenuItem component={Link} variant="body2" to={{ pathname: `/${user.username}` }} target="_blank">
          {t('nav.visit-my-page')}
          <FontAwesomeSvgIcon icon={faExternalLinkAlt} fontSize="inherit"></FontAwesomeSvgIcon>
        </MenuItem>

        {/* my ... */}
        <Divider></Divider>
        {myItems.map(({ id, href, icon, label, isDivider }) => {
          if (isDivider === true) {
            return <Divider key={id} />
          }
          let itemIcon = undefined
          if (icon !== undefined) {
            itemIcon = (
              <ListItemIcon>
                <FontAwesomeSvgIcon icon={icon} fontSize="small"></FontAwesomeSvgIcon>
              </ListItemIcon>
            )
          }
          return (
            <MenuItem component={Link} key={id} to={href}>
              {itemIcon}
              <ListItemText>{label}</ListItemText>
            </MenuItem>
          )
        })}
      </Menu>
    </React.Fragment>
  )
}

const Index = () => {
  const { data: user } = useLogin()

  // Not logged in.
  if (!user) {
    return <LoginButton />
  }

  return <AvatarWithMenu user={user} />
}

export default Index
