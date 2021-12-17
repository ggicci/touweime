import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import PublicUserList from 'components/PublicUserList'
import RegistrationGuide from 'components/RegistrationGuide'
import type { NextPage } from 'next'
import useTranslation from 'next-translate/useTranslation'
import React from 'react'

const SloganSection = () => {
  const { t } = useTranslation('common')

  return (
    <Box sx={{ textAlign: 'center', py: 15 }}>
      <Stack spacing={2}>
        <Typography variant="h1" fontSize={'3rem'}>
          {t('site.slogan')}
        </Typography>
        <Typography variant="h6" component="h2">
          {t('site.description')}
        </Typography>
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={10} md={8}>
            <RegistrationGuide></RegistrationGuide>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  )
}

const Home: NextPage = () => {
  return (
    <React.Fragment>
      <Container>
        <SloganSection></SloganSection>
        <PublicUserList></PublicUserList>
      </Container>
    </React.Fragment>
  )
}

export default Home
