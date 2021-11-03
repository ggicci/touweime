import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import useTranslation from 'next-translate/useTranslation'
import React from 'react'
import { PayeeCodeSettings } from 'src/store/settings'

export type Props = {
  open: boolean
  onClose: () => void
  settings: PayeeCodeSettings
}

const Index = (props: Props) => {
  const { t } = useTranslation('settings')
  const { open, onClose, settings } = props

  function handleCancel() {
    onClose()
  }

  function handleSave() {
    onClose()
  }

  return (
    <Dialog maxWidth="md" open={open} onClose={onClose}>
      <DialogTitle>{t(settings.kind)}</DialogTitle>
      <DialogContent>
        <pre>{JSON.stringify(settings, null, 2)}</pre>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          {t('common:cancel')}
        </Button>
        <Button autoFocus onClick={handleSave}>
          {t('common:save')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

Index.className = 'Settings.Payment.ConfigurePayeeCode'

export default Index
