import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import LinearProgress from '@mui/material/LinearProgress'
import AboutMe from 'components/User/AboutMe'
import Header from 'components/User/Header'
import UserNotFound from 'components/User/NotFound'
import SupportPanel from 'components/User/SupportPanel'
import { Settings } from 'lib/settings'
import { useUserSupport } from 'lib/support'
import { User } from 'lib/users'
import useTranslation from 'next-translate/useTranslation'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

interface MetaTagsProps {
  user: User
  settings: Settings
}

const MetaTags = ({ user, settings }: MetaTagsProps) => {
  const router = useRouter()
  const { t } = useTranslation('common')
  const title = settings.bio ? `${user.display} - ${settings.bio}` : user.display
  const siteTitle = t('site.title')

  return (
    <Head>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={settings.about_me.substring(0, 220)} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${process.env.NEXT_PUBLIC_HOST}${router.asPath}`} />
      <meta property="og:image" content={user.avatar} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:locale" content={router.locale} />
    </Head>
  )
}

const UserHome = () => {
  const router = useRouter()
  const username = router.query.user as string
  const { data, error } = useUserSupport(username)
  const isLoading = !data && !error

  if (isLoading) {
    return <LinearProgress></LinearProgress>
    return null
  }

  if (!data) {
    return <UserNotFound username={username} />
  }

  const { user, settings } = data
  return (
    <React.Fragment>
      <MetaTags user={user} settings={settings}></MetaTags>
      <Header username={user.username}></Header>
      <Container sx={{ py: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={true} md={8}>
            <AboutMe settings={settings}></AboutMe>
          </Grid>
          <Grid item xs={12} sm={'auto'} md={4}>
            <SupportPanel username={user.username}></SupportPanel>
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  )
}

export default UserHome
