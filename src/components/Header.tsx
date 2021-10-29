import { AppBar, Box, Container, Toolbar, useTheme } from '@mui/material'
import Image from 'next/image'
import React from 'react'
import Link from 'src/components/Link'
import { HomeRoute } from 'src/routes'

const SiteLogo = () => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Image src="/logo.svg" width={40} height={40} alt="site logo"></Image>
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
          boxShadow: `inset 0px -1px 1px ${theme.palette.grey[100]}`,
          backdropFilter: 'blur(20px)',
          transition: theme.transitions.create('top'),
          top: 0,
        }}
      >
        <Toolbar>
          <Container>
            <Link href={HomeRoute.href}>
              <SiteLogo></SiteLogo>
            </Link>
          </Container>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  )
}
