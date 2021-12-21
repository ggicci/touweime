import { AppBar, Box, Container, IconButton, Toolbar, useTheme } from '@mui/material'
import Typography from '@mui/material/Typography'
import FontAwesomeSvgIcon from 'components/FontAwesomeSvgIcon'
import Link from 'components/Link'
import UserMenu from 'components/UserMenu'
import useTranslation from 'next-translate/useTranslation'
import Image from 'next/image'
import React from 'react'
import { DiscoverRoute, HomeRoute, SupportRoute } from 'routes'

const LOGOS = [
  'fried-egg.svg',
  'popsicle.svg',
  'chips.svg',
  'doughnut.svg',
  'pizza.svg',
  'lobster.svg',
  'grapes.svg',
  'drumstick.svg',
  'fish.svg',
  'apple.svg',
  'cheese.svg',
  'shrimp.svg',
  'instant-noodles.svg',
  'sushi.svg',
  'hot-dog.svg',
  'avocado.svg',
  'leaves.svg',
  'bread.svg',
  'onion.svg',
  'kamaboko.svg',
  'cupcake.svg',
  'beef.svg',
  'burger.svg',
]

const SiteLogo = () => {
  const { t } = useTranslation('common')
  const logo = LOGOS[Math.floor(Math.random() * LOGOS.length)]
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
      <Image src={`/images/${logo}`} width={40} height={40} alt="site logo"></Image>
      <Typography variant="h1" sx={{ ml: 2, fontSize: '1.75rem', fontWeight: 400 }}>
        {t('site.title')}
      </Typography>
    </Box>
  )
}

const AppNavItems = () => {
  const items = [HomeRoute, DiscoverRoute, SupportRoute].map((x) => ({ ...x, label: x.id }))

  return (
    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
      {items.map(({ id, href, icon }) => (
        <IconButton component={Link} key={id} to={href} color="inherit">
          <FontAwesomeSvgIcon icon={icon}></FontAwesomeSvgIcon>
        </IconButton>
      ))}
    </Box>
  )
}

export default function Header() {
  const theme = useTheme()

  return (
    <React.Fragment>
      {/* TODO(ggicci): make the style reusable https://mui.com/customization/how-to-customize/#2-reusable-style-overrides */}
      <AppBar
        color="inherit"
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.72)',
          boxShadow: `inset 0px -1px 1px ${theme.palette.grey[300]}`,
          backdropFilter: 'blur(5px)',
          transition: theme.transitions.create('top'),
          top: 0,
        }}
      >
        <Container disableGutters={true}>
          <Toolbar>
            <Link to="/" underline="none" forceReload>
              <SiteLogo></SiteLogo>
            </Link>
            <Box sx={{ flexGrow: 1 }}></Box>
            {/* <AppNavItems></AppNavItems> */}
            <UserMenu></UserMenu>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Trick, see https://github.com/mui-org/material-ui/issues/16844#issuecomment-517205129 */}
      <Toolbar></Toolbar>
    </React.Fragment>
  )
}
