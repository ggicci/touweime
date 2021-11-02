import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import useTranslation from 'next-translate/useTranslation'
import React from 'react'
import FontAwesomeSvgIcon from 'src/components/FontAwesomeSvgIcon'
import Link from 'src/components/Link'
import { formatHref, HelpRoute, LoginRoute, LogoutRoute, Route, SettingsRoute } from 'src/routes'
import { User, useUser } from 'src/store/users'

function LoginButton() {
  const { t } = useTranslation('common')

  return (
    <Button
      color="inherit"
      href={formatHref(LoginRoute.href)}
      startIcon={<FontAwesomeSvgIcon icon={LoginRoute.icon!}></FontAwesomeSvgIcon>}
    >
      {t(LoginRoute.id)}
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
    // ...ConsoleRoute.children.map((x) => ({ ...x, label: t(x.id) })),
    { ...SettingsRoute, label: t(SettingsRoute.id) },
    { ...HelpRoute, label: t(HelpRoute.id) },
    { id: 'divider-1', href: {}, isDivider: true },
    { ...LogoutRoute, label: t(LogoutRoute.id) },
  ]

  return (
    <React.Fragment>
      <IconButton onClick={handleClick} size="small" sx={{ ml: 2 }}>
        <Avatar sx={{ width: 32, height: 32 }} src={user.avatar} alt={user.username}>
          {user.username[0]}
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
        <MenuItem>
          {t('signed-in-as')} &nbsp;
          <Typography sx={{ fontWeight: 'medium' }}>{user.username}</Typography>
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
            <MenuItem dense component={Link} key={id} href={formatHref(href)}>
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
  const { data: user } = useUser()

  // Not logged in.
  if (!user) {
    return <LoginButton />
  }

  return <AvatarWithMenu user={user} />
}

export default Index
