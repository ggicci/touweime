import Avatar from '@mui/material/Avatar'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import IconButton from '@mui/material/IconButton'
import Slide from '@mui/material/Slide'
import useTranslation from 'next-translate/useTranslation'
import React from 'react'
import { User } from 'sdk/users'

interface Props {
  open: boolean
  user: User
  thanks: string
  onClose: () => void
}

const ThanksWindow = (props: Props) => {
  const { t } = useTranslation('common')
  const { open, user, thanks, onClose } = props
  const defualtThanks = t('defaultThanks')
  const linearGradient = 'linear-gradient(to left top, #ff6f91, #ff807d, #ff966d, #ffae61, #ffc75f)'
  const sentences = (thanks || defualtThanks).split('\n')

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth={true}
      PaperProps={{
        sx: { overflow: 'visible', background: linearGradient },
      }}
      TransitionComponent={Slide}
    >
      <IconButton
        sx={{
          position: 'absolute',
          top: -60,
          alignSelf: 'center',
        }}
      >
        <Avatar
          src={user.avatar}
          sx={{
            width: 120,
            height: 120,
            border: '3px solid rgba(255,255,255,0.27)',
            fontSize: 60,
          }}
        >
          🎉
        </Avatar>
      </IconButton>
      <DialogContent sx={{ pt: '115px' }}>
        <DialogContentText align="center" variant="h4" color="white" paragraph>
          {sentences.map((sentence) => (
            <div key={sentence}>{sentence}</div>
          ))}
        </DialogContentText>
      </DialogContent>
    </Dialog>
  )
}

export default ThanksWindow
