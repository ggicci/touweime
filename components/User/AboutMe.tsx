import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import MarkdownRenderer from 'components/MarkdownRenderer'
import { Settings } from 'lib/settings'
import useTranslation from 'next-translate/useTranslation'
import React from 'react'

interface AboutMeProps {
  settings: Settings
}

const AboutMe = (props: AboutMeProps) => {
  const { t } = useTranslation('common')
  const { settings } = props

  let content
  if (settings.about_me) {
    content = <MarkdownRenderer markdown={settings.about_me}></MarkdownRenderer>
  } else {
    content = <Typography>{t('user-page.about-me.empty-bio')}</Typography>
  }

  return (
    <Container component={Paper} variant="outlined" sx={{ py: 2 }}>
      {content}
    </Container>
  )
}

export default AboutMe
