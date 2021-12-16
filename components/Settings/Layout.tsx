import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListSubheader from '@mui/material/ListSubheader'
import Paper from '@mui/material/Paper'
import FontAwesomeSvgIcon from 'components/FontAwesomeSvgIcon'
import Link from 'components/Link'
import PageContext from 'components/PageContext'
import useTranslation from 'next-translate/useTranslation'
import { ReactChild } from 'react'
import { SettingsRoute } from 'routes'

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
                    <ListItem key={route.id} component={Link} to={route.href} color="inherit" disablePadding>
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
