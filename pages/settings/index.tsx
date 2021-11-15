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
import DoubleFacedButton from 'components/DoubleFacedButton'
import FontAwesomeSvgIcon from 'components/FontAwesomeSvgIcon'
import ConfigurePayeeCodeDialog from 'components/Settings/Payment/ConfigurePayeeCodeDialog'
import useTranslation from 'next-translate/useTranslation'
import React from 'react'
import { SettingsRoute } from 'routes'
import { PaymentState, Settings, updateSettings, useSettings } from 'sdk/settings'

interface SettingsProps {
  settings: Settings
}

const FavoriteFoodSettings = (props: SettingsProps) => {
  return <React.Fragment>TODO</React.Fragment>
}

const PaymentSettings = (props: SettingsProps & { onSaved: () => void }) => {
  const { settings, onSaved } = props
  return (
    <List>
      <PaymentMethodListItem key="alipay" kind="alipay" settings={settings} onSaved={onSaved}></PaymentMethodListItem>
      <PaymentMethodListItem key="wepay" kind="wepay" settings={settings} onSaved={onSaved}></PaymentMethodListItem>
    </List>
  )
}

interface PaymentMethodListItemProps extends SettingsProps {
  kind: 'alipay' | 'wepay'
  onSaved: () => void
}

const PaymentMethodListItem = (props: PaymentMethodListItemProps) => {
  const { settings, kind, onSaved } = props
  const { t } = useTranslation('settings')
  const payApp = kind === 'alipay' ? { icon: faAlipay, color: '#03a1e9' } : { icon: faWeixin, color: '#21ac38' }
  const [open, setOpen] = React.useState(false)
  const currentPayment = settings.payment[kind]

  async function setPaymentState(newState: PaymentState) {
    await updateSettings({
      payment: {
        [kind]: {
          state: newState,
        },
      },
    })
    onSaved()
  }

  let ActionButton = null
  if (currentPayment.state === 'unprepared') {
    ActionButton = (
      <Button
        variant="outlined"
        sx={{ borderRadius: 5 }}
        startIcon={<FontAwesomeSvgIcon icon={faExchangeAlt} fontSize="small" />}
        onClick={() => setOpen(true)}
      >
        {t('activate')}
      </Button>
    )
  } else if (currentPayment.state === 'disabled') {
    ActionButton = (
      <DoubleFacedButton
        variant="outlined"
        color="error"
        sx={{ borderRadius: 5 }}
        startIcon={<FontAwesomeSvgIcon icon={faExclamationCircle} fontSize="small" />}
        hoverChildren={t('enable')}
        hoverStartIcon={<FontAwesomeSvgIcon icon={faToggleOff} fontSize="small" />}
        hoverColor="success"
        onClick={() => setPaymentState('enabled')}
      >
        {t(currentPayment.state)}
      </DoubleFacedButton>
    )
  } else if (currentPayment.state === 'enabled') {
    ActionButton = (
      <DoubleFacedButton
        variant="outlined"
        color="success"
        sx={{ borderRadius: 5 }}
        startIcon={<FontAwesomeSvgIcon icon={faCheckCircle} fontSize="small" />}
        hoverChildren={t('disable')}
        hoverStartIcon={<FontAwesomeSvgIcon icon={faToggleOff} fontSize="small" />}
        hoverColor="error"
        onClick={() => setPaymentState('disabled')}
      >
        {t(currentPayment.state)}
      </DoubleFacedButton>
    )
  }

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
          <ListItemText primary={t(`${kind}-payee-code`)} secondary={t(`${kind}-payee-code-help`)}></ListItemText>
        </ListItemButton>
      </ListItem>
      <ConfigurePayeeCodeDialog
        settings={currentPayment}
        kind={kind}
        open={open}
        onClose={() => {
          setOpen(false)
        }}
        onSaved={() => {
          onSaved()
        }}
      ></ConfigurePayeeCodeDialog>
    </React.Fragment>
  )
}

const LinkSettings = (props: SettingsProps) => {
  const { settings } = props

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
      value={settings.link_key}
    ></TextField>
  )
}

const Index = () => {
  const { t } = useTranslation('settings')
  const { data: settings, error, mutate } = useSettings()
  const isLoading = !settings && !error

  if (isLoading) {
    return <Typography variant="h5">{t('loading')}</Typography>
  }

  function handleSaved() {
    mutate(undefined, true)
  }

  return (
    <Container component={Paper} variant="outlined" sx={{ py: 4 }}>
      <Stack spacing={2}>
        <Typography variant="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <FontAwesomeSvgIcon icon={SettingsRoute.icon} fontSize="large"></FontAwesomeSvgIcon>
          {t('title')}
        </Typography>

        {/* settings: favorite foods */}
        {/* <Typography variant="h2">{t('favorite-food')}</Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {t('favorite-food-help')}
        </Typography>
        <FavoriteFoodSettings settings={settings!}></FavoriteFoodSettings> */}

        {/* settings: payment methods */}
        <Typography variant="h2">{t('payment-methods')}</Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {t('payment-methods-help')}
        </Typography>
        <PaymentSettings settings={settings!} onSaved={handleSaved}></PaymentSettings>

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
        <LinkSettings settings={settings!}></LinkSettings>

        <Button variant="contained" size="large" color="primary" sx={{ borderRadius: 5 }}>
          {t('save-changes')}
        </Button>
      </Stack>
    </Container>
  )
}

Index.className = 'Settings'

export default Index
