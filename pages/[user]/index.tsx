import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import AboutMe from 'components/User/AboutMe'
import Header from 'components/User/Header'
import UserNotFound from 'components/User/NotFound'
import SupportPannel from 'components/User/SupportPannel'
import { useRouter } from 'next/router'
import React from 'react'
import { useUserSupport } from 'sdk/support'

const UserHome = () => {
  const router = useRouter()
  const username = router.query.user as string
  const { data } = useUserSupport(username)
  if (!data) {
    return <UserNotFound username={username} />
  }

  const { user, settings } = data
  return (
    <React.Fragment>
      <Header username={user.username}></Header>
      <Container sx={{ py: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={true} md={8}>
            <AboutMe settings={settings}></AboutMe>
          </Grid>
          <Grid item xs={12} sm={'auto'} md={4}>
            <SupportPannel username={user.username}></SupportPannel>
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  )
}

export default UserHome
