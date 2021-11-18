import { Container, Paper, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useSettings } from 'sdk/settings'

const UserHome = () => {
  const router = useRouter()
  const { user: username } = router.query
  const { data: settings } = useSettings()

  if (!settings) {
    return null
  }

  return (
    <Container component={Paper}>
      <Stack>
        <Typography>{username}</Typography>
        <pre>{JSON.stringify(settings, null, 2)}</pre>
      </Stack>
    </Container>
  )
}

export default UserHome
