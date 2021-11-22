import { useTheme } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useUserSupport } from 'sdk/support'

const Header = (props: { username: string }) => {
  const theme = useTheme()
  const { username } = props
  const { data } = useUserSupport(username)

  if (!data) {
    return null
  }

  const { user, settings } = data
  return (
    <Paper elevation={0} sx={{ boxShadow: `inset 0px -1px 1px ${theme.palette.grey[300]}` }}>
      <Container sx={{ py: 4 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          {/* avatar */}
          <IconButton>
            <Avatar alt={user.username} src={user.avatar} sx={{ width: 100, height: 100 }}></Avatar>
          </IconButton>
          {/* bio */}
          <Typography variant="h3">
            <Box component="span">{user.display}</Box>
            <Box component="span" sx={{ ml: 1, fontSize: '1.5rem' }}>
              {settings.bio}
            </Box>
          </Typography>
        </Stack>
      </Container>
    </Paper>
  )
}

export default Header
