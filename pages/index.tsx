import { faLink } from '@fortawesome/free-solid-svg-icons'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import FontAwesomeSvgIcon from 'components/FontAwesomeSvgIcon'
import Link from 'components/Link'
import type { NextPage } from 'next'
import useTranslation from 'next-translate/useTranslation'
import React from 'react'

const SloganSection = () => {
  const { t } = useTranslation('common')

  const startAdornment = (
    <React.Fragment>
      <FontAwesomeSvgIcon icon={faLink} />
      <InputAdornment position="start">
        {
          <Typography
            color="text.primary"
            fontSize={'1.5rem'}
            fontWeight={'bold'}
          >{`${process.env.NEXT_PUBLIC_DOMAIN}/`}</Typography>
        }
      </InputAdornment>
    </React.Fragment>
  )

  const endAdornment = (
    <InputAdornment position="end">
      <Button
        variant="contained"
        size="large"
        disableElevation
        sx={{
          borderRadius: '50px',
          fontWeight: 'bold',
        }}
        component={Link}
        href={{ pathname: '/login' }}
      >
        {t('home-page.make-it-alive')}
      </Button>
    </InputAdornment>
  )

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
          <Grid item xs={12} sm={8} md={6}>
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
                startAdornment: startAdornment,
                endAdornment: endAdornment,
              }}
              placeholder="yourname"
            ></TextField>
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
      </Container>
    </React.Fragment>
  )
}

export default Home
