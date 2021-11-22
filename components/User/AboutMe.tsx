import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import DOMPurify from 'dompurify'
import { marked } from 'marked'
import React from 'react'
import { Settings } from 'sdk/settings'

interface AboutMeProps {
  settings: Settings
}

const AboutMe = (props: AboutMeProps) => {
  const { settings } = props
  const htmlAboutMe = DOMPurify.sanitize(marked.parse(settings.about_me))

  return (
    <Container component={Paper} variant="outlined" sx={{ py: 2 }}>
      <Typography dangerouslySetInnerHTML={{ __html: htmlAboutMe }}></Typography>
    </Container>
  )
}

export default AboutMe
