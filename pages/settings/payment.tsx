import { faAlipay, faWeixin } from '@fortawesome/free-brands-svg-icons'
import { faCheckCircle, faExchangeAlt, faExclamationCircle, faToggleOff } from '@fortawesome/free-solid-svg-icons'
import {
  Avatar,
  Button,
  Container,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import DoubleFacedButton from 'components/DoubleFacedButton'
import FontAwesomeSvgIcon from 'components/FontAwesomeSvgIcon'
import SettingsLayout from 'components/Settings/Layout'
import ConfigurePayeeCodeDialog from 'components/Settings/Payment/ConfigurePayeeCodeDialog'
import useTranslation from 'next-translate/useTranslation'
import { useSnackbar } from 'notistack'
import React from 'react'
import { PayeeCodeKind, PayeeCodeSettings, PaymentState, updateSettings, useSettings } from 'sdk/settings'

interface PaymentMethodListItemProps {
  payment: PayeeCodeSettings
  kind: PayeeCodeKind
  onSaved: () => void
}

const PaymentItem = (props: PaymentMethodListItemProps) => {
  const { kind, payment, onSaved } = props
  const { t } = useTranslation('settings')
  const payApp = kind === 'alipay' ? { icon: faAlipay, color: '#03a1e9' } : { icon: faWeixin, color: '#21ac38' }
  const [open, setOpen] = React.useState(false)

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
  if (payment.state === 'unprepared') {
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
  } else if (payment.state === 'disabled') {
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
        {t(payment.state)}
      </DoubleFacedButton>
    )
  } else if (payment.state === 'enabled') {
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
        {t(payment.state)}
      </DoubleFacedButton>
    )
  }

  return (
    <React.Fragment>
      <ListItem
        disablePadding
        secondaryAction={ActionButton}
        sx={{
          // https://mui.com/customization/how-to-customize/#overriding-nested-component-styles
          '& .MuiListItemButton-root': {
            paddingRight: 16, // 16 * 8 = 128px
          },
        }}
      >
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
        settings={payment}
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

const Payment = () => {
  const { t } = useTranslation('settings')
  const { data: settings, mutate } = useSettings()
  const { enqueueSnackbar } = useSnackbar()

  function handleSaved() {
    mutate()
    enqueueSnackbar(t('common:saved-successfully'), { variant: 'success' })
  }

  if (!settings) {
    return null
  }

  return (
    <SettingsLayout>
      <Container component={Paper} variant="outlined" sx={{ py: 2 }}>
        <Stack spacing={2}>
          <Typography variant="h3">{t('payment-methods')}</Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {t('payment-methods-help')}
          </Typography>
          <List>
            <PaymentItem
              key="alipay"
              kind="alipay"
              payment={settings.payment.alipay}
              onSaved={handleSaved}
            ></PaymentItem>
            <PaymentItem key="wepay" kind="wepay" payment={settings.payment.wepay} onSaved={handleSaved}></PaymentItem>
          </List>
        </Stack>
      </Container>
    </SettingsLayout>
  )
}

Payment.className = 'Payment'

export default Payment
