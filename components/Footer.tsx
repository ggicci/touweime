import AppBar from '@mui/material/AppBar'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Chatwoot from 'components/Chatwoot'
import Link from 'components/Link'
import useTranslation from 'next-translate/useTranslation'
import React from 'react'
import { AboutRoute, HelpRoute, PrivacyRoute, Route, TermsRoute } from 'routes'

export default function Footer() {
  const { t } = useTranslation('common')
  const copyrightText = t('footer.copyright', { year: new Date().getFullYear() })
  const pages: readonly Route[] = [AboutRoute, HelpRoute, PrivacyRoute, TermsRoute]

  const justifyContent = { xs: 'center', sm: 'flex-start' }

  return (
    <React.Fragment>
      <AppBar
        position="static"
        color="inherit"
        variant="outlined"
        elevation={0}
        sx={{
          mt: 3,
          backgroundColor: 'rgba(255, 255, 255, 0.72)',
          backdropFilter: 'blur(5px)',
        }}
      >
        <Container>
          <Toolbar disableGutters component={Grid} container rowSpacing={1} sx={{ py: 2 }}>
            <Grid item display={'flex'} xs={12} sm={true} sx={{ justifyContent }}>
              <Stack direction="row" spacing={{ xs: 1, sm: 2 }}>
                {pages.map((page) => (
                  <Typography
                    key={page.id}
                    to={page.href}
                    underline="hover"
                    variant="body2"
                    color="textSecondary"
                    component={Link}
                  >
                    {t(page.i18nKey)}
                  </Typography>
                ))}
              </Stack>
            </Grid>
            <Grid item display={'flex'} xs={12} sm={'auto'} sx={{ justifyContent }}>
              <Typography component="span" variant="body2" color="textSecondary">
                {copyrightText}
              </Typography>
            </Grid>
          </Toolbar>
        </Container>
      </AppBar>

      <Chatwoot />
    </React.Fragment>
  )
}
