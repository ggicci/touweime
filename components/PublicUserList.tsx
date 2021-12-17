import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'
import Grid from '@mui/material/Grid'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import Link from 'components/Link'
import Image from 'next/image'
import React from 'react'
import { User } from 'sdk/users'
import useSWR from 'swr'

interface Props {
  limit?: number
}

type PublicUser = User & { bio: string }

const UserCard = ({ user }: { user: PublicUser }) => {
  return (
    <ButtonBase component={Link} to={`/${user.username}`}>
      <Box sx={{ width: 180 }}>
        <Box sx={{ position: 'relative', width: 180, height: 180, borderRadius: '5px', overflow: 'hidden' }}>
          <Image src={user.avatar} alt={user.username} layout="fill" objectFit="cover" />
        </Box>
        <Typography gutterBottom sx={{ mt: 1, fontWeight: 'bold' }}>
          {user.display}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {user.bio}
        </Typography>
      </Box>
    </ButtonBase>
  )
}

const PublicUserList = (props: Props) => {
  const { limit } = props
  const { data, error } = useSWR<PublicUser[]>(`/v1/public/users?limit=${limit || 5}`)

  const userList = data || Array(5).fill(null)

  return (
    <Grid container spacing={2} justifyContent="center">
      {userList.map((user, index) => (
        <Grid item key={index}>
          {user ? (
            <UserCard user={user}></UserCard>
          ) : (
            <React.Fragment>
              <Skeleton variant="rectangular" width={180} height={180}></Skeleton>
              <Skeleton height={30} />
              {/* <Skeleton width="60%" /> */}
            </React.Fragment>
          )}
        </Grid>
      ))}
    </Grid>
  )
}

export default PublicUserList
