import { faLaugh, faLink, faMehBlank } from '@fortawesome/free-solid-svg-icons'
import Autocomplete, { AutocompleteRenderInputParams } from '@mui/material/Autocomplete'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Container from '@mui/material/Container'
import InputAdornment from '@mui/material/InputAdornment'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import axios from 'axios'
import ErrorPage from 'components/ErrorPage'
import FontAwesomeSvgIcon from 'components/FontAwesomeSvgIcon'
import SettingsLayout from 'components/Settings/Layout'
import { isUndefined } from 'lodash'
import useTranslation from 'next-translate/useTranslation'
import { useSnackbar } from 'notistack'
import React from 'react'
import { ValidationError, ValidationErrorResponse } from 'sdk/errors'
import { Settings, SettingsPatch, updateSettings, useSettings } from 'sdk/settings'

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

const PageAliveIndicator = ({ alive }: { alive: boolean }) => {
  const { t } = useTranslation('settings')

  if (alive) {
    return (
      <Chip
        size="small"
        icon={<FontAwesomeSvgIcon icon={faLaugh}></FontAwesomeSvgIcon>}
        label={t('profile.page-link.alive')}
        color="success"
      ></Chip>
    )
  }
  return (
    <Tooltip title={t('profile.page-link.not-alive-help')} placement="top">
      <Chip
        size="small"
        icon={<FontAwesomeSvgIcon icon={faMehBlank}></FontAwesomeSvgIcon>}
        label={t('profile.page-link.not-alive')}
        color="info"
      ></Chip>
    </Tooltip>
  )
}

const Profile = () => {
  const { t } = useTranslation('settings')
  const { data: settings, error, mutate } = useSettings()
  const [patch, setPatch] = React.useState({ tags: [] } as SettingsPatch)
  const [dirty, setDirty] = React.useState(false)
  const [validationError, setValidationError] = React.useState(new ValidationError())
  const { enqueueSnackbar } = useSnackbar()

  React.useEffect(() => {
    if (settings) {
      resetPatchState(settings)
    }
  }, [settings])

  function resetPatchState(settings: Settings) {
    setPatch({ tags: settings.tags })
  }

  function handleBioChanged(newBio: string): void {
    setPatch((prevState) => ({ ...prevState, bio: newBio }))
    setDirty(true)
  }

  function handleAboutMeChanged(newAboutMe: string): void {
    setPatch((prevState) => ({ ...prevState, about_me: newAboutMe }))
    setDirty(true)
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
      const updatedSettings = await mutate()
      setDirty(false)
      enqueueSnackbar(t('common:message.saved'), { variant: 'success' })
      setValidationError(new ValidationError())
      resetPatchState(updatedSettings!)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const resp = error.response
        if (resp && resp.status === 422) {
          setValidationError(new ValidationError(resp.data as ValidationErrorResponse))
          enqueueSnackbar(t('common:message.save-failed'), { variant: 'error' })
          return
        }
      }
      enqueueSnackbar((error as Error).message, { variant: 'error' })
    }
  }

  if (!settings) {
    return <ErrorPage isLoading={!error && !settings} error={error} loginRedirect></ErrorPage>
  }

  return (
    <SettingsLayout>
      <Container component={Paper} variant="outlined" sx={{ py: 2 }}>
        <Stack spacing={2}>
          {/* bio */}
          <Typography variant="h3">{t('profile.bio.title')}</Typography>
          <TextField
            variant="outlined"
            value={isUndefined(patch.bio) ? settings.bio : patch.bio}
            onChange={(e) => handleBioChanged(e.target.value)}
            error={!isUndefined(validationError.getFieldError('bio'))}
            helperText={validationError.getFieldError('bio')?.code}
          ></TextField>

          {/* about me */}
          <Typography variant="h3">{t('profile.about-me.title')}</Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {t('profile.about-me.subtitle')}
          </Typography>
          <TextField
            variant="outlined"
            multiline
            minRows={4}
            maxRows={20}
            value={isUndefined(patch.about_me) ? settings.about_me : patch.about_me}
            onChange={(e) => handleAboutMeChanged(e.target.value)}
            error={!isUndefined(validationError.getFieldError('about_me'))}
            helperText={validationError.getFieldError('about_me')?.code}
          ></TextField>

          {/* tags */}
          <Typography variant="h3">{t('profile.tags.title')}</Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {t('profile.tags.subtitle')}
          </Typography>
          <TagSettings
            tags={patch.tags!}
            onChange={handleTagsChanged}
            error={!isUndefined(validationError.getFieldError('tags'))}
          ></TagSettings>

          {/* link_key */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="h3">{t('profile.page-link.title')}</Typography>
            <PageAliveIndicator alive={settings.is_alive}></PageAliveIndicator>
          </Stack>
          <Typography variant="subtitle1" color="text.secondary">
            {t('profile.page-link.subtitle')}
          </Typography>

          <TextField
            variant="outlined"
            InputProps={{
              startAdornment: (
                <React.Fragment>
                  <FontAwesomeSvgIcon icon={faLink} />
                  <InputAdornment position="start">{`${process.env.NEXT_PUBLIC_DOMAIN}/`}</InputAdornment>
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
            {t('profile.save-changes-button')}
          </Button>
        </Stack>
      </Container>
    </SettingsLayout>
  )
}

Profile.className = 'Settings-Profile'

export default Profile
