import {
  Container,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Paper,
} from '@mui/material'
import FontAwesomeSvgIcon from 'components/FontAwesomeSvgIcon'
import Link from 'components/Link'
import PageContext from 'components/PageContext'
import useTranslation from 'next-translate/useTranslation'
import { ReactChild } from 'react'
import { formatHref, SettingsRoute } from 'routes'

const SettingsLayout = ({ children }: { children: ReactChild }) => {
  const { t } = useTranslation('settings')
  return (
    <Container sx={{ py: 3 }}>
      <Grid container spacing={2}>
        <Grid item md={3}>
          <PageContext.Consumer>
            {({ activeRoute }) => (
              <Paper variant="outlined">
                <List
                  component="nav"
                  subheader={<ListSubheader component="div">{t('nav.subheader.account-settings')}</ListSubheader>}
                >
                  {SettingsRoute.children.map((route) => (
                    <ListItem
                      key={route.id}
                      component={Link}
                      href={formatHref(route.href)}
                      color="inherit"
                      disablePadding
                    >
                      <ListItemButton selected={activeRoute?.id == route.id}>
                        <ListItemIcon>
                          <FontAwesomeSvgIcon icon={route.icon!}></FontAwesomeSvgIcon>
                        </ListItemIcon>
                        <ListItemText primary={t(route.i18nKey)}></ListItemText>
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </PageContext.Consumer>
        </Grid>
        <Grid item md={9}>
          {children}
        </Grid>
      </Grid>
    </Container>
  )
}

SettingsLayout.className = 'SettingsLayout'

export default SettingsLayout
