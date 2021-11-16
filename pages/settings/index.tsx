import { faAlipay, faWeixin } from '@fortawesome/free-brands-svg-icons'
import {
  faCheckCircle,
  faExchangeAlt,
  faExclamationCircle,
  faLink,
  faToggleOff,
} from '@fortawesome/free-solid-svg-icons'
import Autocomplete, { AutocompleteRenderInputParams } from '@mui/material/Autocomplete'
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
import axios from 'axios'
import DoubleFacedButton from 'components/DoubleFacedButton'
import FontAwesomeSvgIcon from 'components/FontAwesomeSvgIcon'
import ConfigurePayeeCodeDialog from 'components/Settings/Payment/ConfigurePayeeCodeDialog'
import { isUndefined } from 'lodash'
import useTranslation from 'next-translate/useTranslation'
import { useSnackbar } from 'notistack'
import React from 'react'
import { SettingsRoute } from 'routes'
import { ValidationError, ValidationErrorResponse } from 'sdk/errors'
import { PaymentState, Settings, SettingsPatch, updateSettings, useSettings } from 'sdk/settings'

interface SettingsProps {
  settings: Settings
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

interface TagSettingsProps {
  tags: string[]
  onChange: (value: string[]) => void
  error: boolean
}

const TagSettings = (props: TagSettingsProps) => {
  const { tags, onChange, error } = props
  const top100Tags = ['开发者', '设计师', '书法创作', '国画创作', '艺术创作', '作家']

  function renderInput(params: AutocompleteRenderInputParams, error: boolean) {
    return <TextField {...params} error={error}></TextField>
  }

  return (
    <Autocomplete
      multiple
      freeSolo
      options={top100Tags}
      filterSelectedOptions
      renderInput={(params) => renderInput(params, error)}
      onChange={(_, value) => onChange(value)}
      value={tags}
    ></Autocomplete>
  )
}

const Index = () => {
  const { t } = useTranslation('settings')
  const { data: settings, mutate } = useSettings()
  const [patch, setPatch] = React.useState({ tags: [] } as SettingsPatch)
  const [dirty, setDirty] = React.useState(false)
  const [validationError, setValidationError] = React.useState(new ValidationError())
  const { enqueueSnackbar } = useSnackbar()

  React.useEffect(() => {
    if (settings) {
      setPatch((prevState) => ({ ...prevState, tags: settings.tags }))
    }
  }, [settings])

  // const isLoading = !settings && !error
  if (!settings) {
    return <Typography variant="h5">{t('loading')}</Typography>
  }

  function handleTagsChanged(newTags: string[]): void {
    setPatch((prevState) => ({ ...prevState, tags: newTags }))
    setDirty(true)
  }

  function handleLinkKeyChanged(newLinkKey: string): void {
    setPatch((prevState) => ({ ...prevState, link_key: newLinkKey }))
    setDirty(true)
  }

  async function saveChanges() {
    try {
      await updateSettings(patch)
      handleSaved()
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const resp = error.response
        if (resp && resp.status === 422) {
          setValidationError(new ValidationError(resp.data as ValidationErrorResponse))
          enqueueSnackbar(t('common:save-failed'), { variant: 'error' })
          return
        }
      }
      enqueueSnackbar((error as Error).message, { variant: 'error' })
    }
  }

  function handleSaved() {
    mutate()
    setDirty(false)
    enqueueSnackbar(t('common:saved-successfully'), { variant: 'success' })
    setValidationError(new ValidationError())
  }

  return (
    <Container component={Paper} variant="outlined" sx={{ py: 4 }}>
      <Stack spacing={2}>
        <Typography variant="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <FontAwesomeSvgIcon icon={SettingsRoute.icon} fontSize="large"></FontAwesomeSvgIcon>
          {t('title')}
        </Typography>

        {/* settings: payment methods */}
        <Typography variant="h2">{t('payment-methods')}</Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {t('payment-methods-help')}
        </Typography>
        <PaymentSettings settings={settings} onSaved={handleSaved}></PaymentSettings>

        {/* settings: tags */}
        <Typography variant="h2">{t('tag')}</Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {t('tag-help')}
        </Typography>
        <TagSettings
          tags={patch.tags!}
          onChange={handleTagsChanged}
          error={!isUndefined(validationError.getFieldError('tags'))}
        ></TagSettings>

        {/* settings: page link */}
        <Typography variant="h2">{t('page-link')}</Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {t('page-link-help')}
        </Typography>

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
          value={isUndefined(patch.link_key) ? settings.link_key : patch.link_key}
          onChange={(e) => handleLinkKeyChanged(e.target.value)}
          error={!isUndefined(validationError.getFieldError('link_key'))}
          helperText={validationError.getFieldError('link_key')?.code}
        ></TextField>

        <Button
          variant="contained"
          size="large"
          color="primary"
          sx={{ borderRadius: 5 }}
          disabled={!dirty}
          onClick={saveChanges}
        >
          {t('save-changes')}
        </Button>
      </Stack>
    </Container>
  )
}

Index.className = 'Settings'

export default Index
