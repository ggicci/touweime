import { faAlipay, faWeixin } from '@fortawesome/free-brands-svg-icons'
import {
  faCheckCircle,
  faExchangeAlt,
  faExclamationCircle,
  faLink,
  faToggleOff,
} from '@fortawesome/free-solid-svg-icons'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import InputAdornment from '@mui/material/InputAdornment'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import useTranslation from 'next-translate/useTranslation'
import React from 'react'
import DoubleFacedButton from 'src/components/DoubleFacedButton'
import FontAwesomeSvgIcon from 'src/components/FontAwesomeSvgIcon'
import ConfigurePayeeCodeDialog from 'src/components/Settings/Payment/ConfigurePayeeCodeDialog'
import { SettingsRoute } from 'src/routes'
import { AlipaySettings, Settings, useSettings, WepaySettings } from 'src/sdk/settings'

interface PaymentMethodListItemProps {
  settings: AlipaySettings | WepaySettings
}

const PaymentMethodListItem = (props: PaymentMethodListItemProps) => {
  const { settings } = props
  const { t } = useTranslation('settings')
  const payApp = settings.kind.startsWith('alipay')
    ? { icon: faAlipay, color: '#03a1e9' }
    : { icon: faWeixin, color: '#21ac38' }

  let ActionButton = null
  if (settings.state === 'unprepared') {
    ActionButton = (
      <Button
        variant="outlined"
        sx={{ borderRadius: 5 }}
        startIcon={<FontAwesomeSvgIcon icon={faExchangeAlt} fontSize="small" />}
      >
        {t('activate')}
      </Button>
    )
  } else if (settings.state === 'disabled') {
    ActionButton = (
      <DoubleFacedButton
        variant="outlined"
        color="error"
        sx={{ borderRadius: 5 }}
        startIcon={<FontAwesomeSvgIcon icon={faExclamationCircle} fontSize="small" />}
        hoverChildren={t('enable')}
        hoverStartIcon={<FontAwesomeSvgIcon icon={faToggleOff} fontSize="small" />}
        hoverColor="success"
      >
        {t(settings.state)}
      </DoubleFacedButton>
    )
  } else if (settings.state === 'enabled') {
    ActionButton = (
      <DoubleFacedButton
        variant="outlined"
        color="success"
        sx={{ borderRadius: 5 }}
        startIcon={<FontAwesomeSvgIcon icon={faCheckCircle} fontSize="small" />}
        hoverChildren={t('disable')}
        hoverStartIcon={<FontAwesomeSvgIcon icon={faToggleOff} fontSize="small" />}
        hoverColor="error"
      >
        {t(settings.state)}
      </DoubleFacedButton>
    )
  }

  const [open, setOpen] = React.useState(false)

  return (
    <React.Fragment>
      <ListItem disablePadding secondaryAction={ActionButton}>
        <ListItemButton
          onClick={() => {
            setOpen(true)
          }}
        >
          <ListItemAvatar>
            <Avatar variant="rounded" sx={{ bgcolor: 'background.default', width: 48, height: 48 }}>
              <FontAwesomeSvgIcon icon={payApp.icon} fontSize="large" sx={{ color: payApp.color }}></FontAwesomeSvgIcon>
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={t(settings.kind)} secondary={t(`${settings.kind}-help`)}></ListItemText>
        </ListItemButton>
      </ListItem>
      <ConfigurePayeeCodeDialog
        settings={settings}
        open={open}
        onCancelled={() => {
          setOpen(false)
        }}
        onSaved={(settings) => {
          console.info('saved:', settings)
          setOpen(false)
        }}
      ></ConfigurePayeeCodeDialog>
    </React.Fragment>
  )
}

interface SettingsProps {
  settings: Settings
}

const FavoriteFoodSettings = (props: SettingsProps) => {
  return <React.Fragment>TODO</React.Fragment>
}

const PaymentMethodSettings = (props: SettingsProps) => {
  const { settings } = props
  const paymentMethods = settings.payment

  return (
    <List>
      {[paymentMethods.alipay, paymentMethods.wepay].map((method) => {
        return <PaymentMethodListItem key={method.id} settings={method}></PaymentMethodListItem>
      })}
    </List>
  )
}

const LinkSettings = (props: SettingsProps) => {
  const { settings } = props
  const linkSettings = settings.link

  return (
    <TextField
      variant="outlined"
      InputProps={{
        startAdornment: (
          <React.Fragment>
            <FontAwesomeSvgIcon icon={faLink} />
            <InputAdornment position="start">{`${process.env.NEXT_PUBLIC_HOST}/`}</InputAdornment>
          </React.Fragment>
        ),
      }}
      defaultValue={linkSettings.key}
    ></TextField>
  )
}

const Index = () => {
  const { t } = useTranslation('settings')
  const { data: settings } = useSettings()

  return (
    <Container component={Paper} variant="outlined" sx={{ py: 4 }}>
      <Stack spacing={2}>
        <Typography variant="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <FontAwesomeSvgIcon icon={SettingsRoute.icon} fontSize="large"></FontAwesomeSvgIcon>
          {t('title')}
        </Typography>

        {/* settings: favorite foods */}
        <Typography variant="h2">{t('favorite-food')}</Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {t('favorite-food-help')}
        </Typography>
        <FavoriteFoodSettings settings={settings}></FavoriteFoodSettings>

        {/* settings: payment methods */}
        <Typography variant="h2">{t('payment-methods')}</Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {t('payment-methods-help')}
        </Typography>
        <PaymentMethodSettings settings={settings}></PaymentMethodSettings>

        {/* settings: tags */}
        <Typography variant="h2">{t('tag')}</Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {t('tag-help')}
        </Typography>

        {/* settings: page link */}
        <Typography variant="h2">{t('page-link')}</Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {t('page-link-help')}
        </Typography>
        <LinkSettings settings={settings}></LinkSettings>

        <Button variant="contained" size="large" color="primary" sx={{ borderRadius: 5 }}>
          {t('save-changes')}
        </Button>
      </Stack>
    </Container>
  )
}

export default Index
