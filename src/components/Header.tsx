import { AppBar, Box, Container, IconButton, Toolbar, useTheme } from '@mui/material'
import Image from 'next/image'
import React from 'react'
import FontAwesomeSvgIcon from 'src/components/FontAwesomeSvgIcon'
import Link from 'src/components/Link'
import UserMenu from 'src/components/UserMenu'
import { DiscoverRoute, HomeRoute, SupportRoute } from 'src/routes'

const SiteLogo = () => {
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
      <Image src="/logo.svg" width={40} height={40} alt="site logo"></Image>
    </Box>
  )
}

const AppNavItems = () => {
  const items = [HomeRoute, DiscoverRoute, SupportRoute].map((x) => ({ ...x, label: x.id }))

  return (
    <Box sx={{ px: 2 }}>
      {items.map(({ id, href, icon }) => (
        <IconButton component={Link} key={id} href={href} color="inherit">
          <FontAwesomeSvgIcon icon={icon}></FontAwesomeSvgIcon>
        </IconButton>
      ))}
      <UserMenu></UserMenu>
    </Box>
  )
}

export default function Header() {
  const theme = useTheme()

  return (
    <React.Fragment>
      <AppBar
        color="inherit"
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.72)',
          boxShadow: `inset 0px -1px 1px ${theme.palette.grey[200]}`,
          backdropFilter: 'blur(5px)',
          transition: theme.transitions.create('top'),
          top: 0,
        }}
      >
        <Container disableGutters={true}>
          <Toolbar>
            <Link href={HomeRoute.href} underline="none">
              <SiteLogo></SiteLogo>
            </Link>
            <Box sx={{ flexGrow: 1 }}></Box>
            <AppNavItems></AppNavItems>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Trick, see https://github.com/mui-org/material-ui/issues/16844#issuecomment-517205129 */}
      <Toolbar></Toolbar>
    </React.Fragment>
  )
}
