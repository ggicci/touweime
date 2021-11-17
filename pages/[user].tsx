import { Container, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/router'

const UserHome = () => {
  const router = useRouter()
  const { user: username } = router.query

  return (
    <Container>
      <Stack>
        <Typography>{username}</Typography>
      </Stack>
    </Container>
  )
}

export default UserHome
