import AppBar from '@mui/material/AppBar'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Link from 'components/Link'
import useTranslation from 'next-translate/useTranslation'
import React from 'react'
import { AboutRoute, HelpRoute, PrivacyRoute, Route, TermsRoute } from 'routes'

export default function Footer() {
  const { t } = useTranslation('common')
  const copyrightText = t('footer.copyright', { year: new Date().getFullYear() })
  const pages: readonly Route[] = [AboutRoute, HelpRoute, PrivacyRoute, TermsRoute]

  return (
    <AppBar
      position="static"
      color="inherit"
      variant="outlined"
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.72)',
        backdropFilter: 'blur(5px)',
      }}
    >
      <Container>
        <Toolbar>
          <Stack direction="row" spacing={2} sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Link key={page.id} href={page.href} underline="hover">
                <Typography variant="body2" color="textSecondary">
                  {t(page.i18nKey)}
                </Typography>
              </Link>
            ))}
          </Stack>

          <Typography variant="body2">{copyrightText}</Typography>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
