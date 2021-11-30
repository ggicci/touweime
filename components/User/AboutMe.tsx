import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import DOMPurify from 'dompurify'
import { marked } from 'marked'
import useTranslation from 'next-translate/useTranslation'
import React from 'react'
import { Settings } from 'sdk/settings'

interface AboutMeProps {
  settings: Settings
}

const AboutMe = (props: AboutMeProps) => {
  const { t } = useTranslation('common')
  const { settings } = props

  let aboutMeContent = null
  const htmlAboutMe = DOMPurify.sanitize(marked.parse(settings.about_me))

  if (htmlAboutMe === '') {
    aboutMeContent = <Typography textAlign="center">{t('user-page.about-me.empty-bio')}</Typography>
  } else {
    aboutMeContent = <Typography dangerouslySetInnerHTML={{ __html: htmlAboutMe }}></Typography>
  }

  return (
    <Container component={Paper} variant="outlined" sx={{ py: 2 }}>
      {aboutMeContent}
    </Container>
  )
}

export default AboutMe
