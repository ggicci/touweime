import { faApple, faGithub } from '@fortawesome/free-brands-svg-icons'
import { faKey, faUser } from '@fortawesome/free-solid-svg-icons'
import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import axios from 'axios'
import FontAwesomeSvgIcon from 'components/FontAwesomeSvgIcon'
import { gaiaApi } from 'lib/axios'
import { getRandomPhoto, Photo } from 'lib/unsplash'
import { GetServerSideProps } from 'next'
import useTranslation from 'next-translate/useTranslation'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { User } from 'sdk/users'
import { format } from 'url'

// See https://image-component.nextjs.gallery/background

const BackgroundWrapper = styled('div')(
  ({ theme }) => `
    position: 'fixed';
    height: '100vh';
    width: '100vw';
    overflow: 'hidden';
    z-index: -1`,
)

function buildSigninUrl(returnTo: string): string {
  const authRedirectURL = { pathname: '/login', query: { return_to: returnTo || '/' } }

  const authURL = {
    pathname: '/api.proxy/gaia/v1/login/oauth2',
    query: {
      app_id: 'touwei-github',
      redirect_uri: format(authRedirectURL),
    },
  }

  return format(authURL)
}

interface Props {
  backgroundImage: Photo | null
}

const Login = (props: Props) => {
  const { t } = useTranslation('common')
  const [isSigningWithGitHub, setIsSigningWithGitHub] = useState(false)
  const imageURL = props.backgroundImage ? props.backgroundImage.urls.full : ''

  return (
    <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 16 }}>
      <BackgroundWrapper>
        <Image alt="Background" src={imageURL} layout="fill" objectFit="cover" quality={100}></Image>
      </BackgroundWrapper>
      <Box sx={{ flexGrow: 1, maxWidth: 600 }}>
        <Card variant="outlined" sx={{ backgroundColor: 'rgba(255, 255, 255, 0.72)', backdropFilter: 'blur(5px)' }}>
          {/* <CardMedia component="img" height="280" image="/site-enter-cover.jpg" alt="site enter cover"></CardMedia> */}
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h5" align="center">
                {t('site.welcome')}
              </Typography>
              <Typography variant="body1" align="center">
                {t('site.slogan', { countUsers: 0 })}
              </Typography>
              {/* continue with GitHub */}
              <Link href={buildSigninUrl('/')} locale={false} passHref>
                <LoadingButton
                  variant="contained"
                  color="github"
                  size="large"
                  startIcon={<FontAwesomeSvgIcon icon={faGithub}></FontAwesomeSvgIcon>}
                  fullWidth
                  onClick={() => setIsSigningWithGitHub(true)}
                  loading={isSigningWithGitHub}
                >
                  {t('login-page.continue-with-github')}
                </LoadingButton>
              </Link>

              <Button
                variant="contained"
                color="apple"
                size="large"
                startIcon={<FontAwesomeSvgIcon icon={faApple}></FontAwesomeSvgIcon>}
                fullWidth
              >
                {t('login-page.continue-with-apple')}
              </Button>

              <Divider variant="middle">OR</Divider>

              {/* user */}
              <TextField
                variant="standard"
                label={t('login-page.username')}
                InputProps={{
                  startAdornment: <FontAwesomeSvgIcon icon={faUser}></FontAwesomeSvgIcon>,
                }}
              ></TextField>

              {/* password */}
              <TextField
                variant="standard"
                label={t('login-page.password')}
                type="password"
                InputProps={{
                  startAdornment: <FontAwesomeSvgIcon icon={faKey}></FontAwesomeSvgIcon>,
                }}
              ></TextField>

              {/* submit */}
              <Button variant="contained" color="primary" size="large">
                {t('login-page.login')}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const cookies = req.headers.cookie || ''

  try {
    await gaiaApi.get<User>('/v1/user', {
      headers: {
        Cookie: cookies,
      },
    })
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    }
  } catch (err) {
    if (!axios.isAxiosError(err)) {
      throw err
    }
    if (err.response && err.response.status !== 401) {
      throw err
    }
  }

  // Get a random photo from unsplash.
  const photo = await getRandomPhoto()
  return { props: { backgroundImage: photo } }
}

export default Login
