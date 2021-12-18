import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
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

  return (
    <Container component={Paper} variant="outlined" sx={{ py: 2 }}>
      <MarkdownRenderer markdown={settings.about_me}></MarkdownRenderer>
    </Container>
  )
}

export default AboutMe
