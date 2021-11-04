import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonBase from '@mui/material/ButtonBase'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import ImageListItemBar from '@mui/material/ImageListItemBar'
import Stack from '@mui/material/Stack'
import isEmpty from 'lodash/isEmpty'
import useTranslation from 'next-translate/useTranslation'
import React from 'react'
import { BarcodeProfile, PayeeCodeSettings } from 'src/sdk/settings'

const centsToYuan = (price: number) => {
  return `${price / 100}`
}

const BarcodeEditor = (props: { barcode: BarcodeProfile; open: boolean; onClose: () => void }) => {
  const { barcode, open, onClose } = props

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{centsToYuan(barcode.price_cents)}</DialogTitle>
      <DialogContent>
        <img src={barcode.url} />
      </DialogContent>
    </Dialog>
  )
}

const BarcodeDisplay = (props: { barcode: BarcodeProfile }) => {
  const { barcode } = props
  const [open, setOpen] = React.useState(false)

  function handleClick() {
    setOpen(true)
  }

  return (
    <ImageListItem>
      <ButtonBase
        sx={{
          width: 120,
          height: 120,
          bgcolor: barcode.url ? 'success.main' : 'grey.400',
          fontSize: '2em',
        }}
        onClick={handleClick}
      >
        {centsToYuan(barcode.price_cents)}
      </ButtonBase>
      <ImageListItemBar sx={{ height: 30 }} title="CNY"></ImageListItemBar>

      <BarcodeEditor barcode={barcode} open={open} onClose={() => setOpen(false)} />
    </ImageListItem>
  )
}

export type Props = {
  open: boolean
  settings: PayeeCodeSettings
  onCancelled: () => void
  onSaved: (settings: PayeeCodeSettings) => void
}

const Index = (props: Props) => {
  const { t } = useTranslation('settings')
  const { open, onCancelled, onSaved, settings } = props

  function handleCancel() {
    onCancelled()
  }

  function handleSave() {
    onSaved(settings)
  }

  const PRICE_PRESETS = [100, 500, 1000, 2000, 5000, 10000]

  if (isEmpty(settings.barcodes)) {
    settings.barcodes = PRICE_PRESETS.map((x, i) => ({ id: i, price_cents: x, url: null }))
  }

  return (
    <Dialog maxWidth="md" open={open} scroll="paper">
      <DialogTitle>{t(settings.kind)}</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end', alignItems: 'center' }}>
            <Box sx={{ color: 'success.main' }}>&#9632;</Box>
            <Box>{t('uploaded')}</Box>
            <Box sx={{ color: 'grey.400' }}>&#9632;</Box>
            <Box>{t('not-uploaded')}</Box>
          </Stack>
          <ImageList cols={3}>
            {settings.barcodes.map((barcode) => {
              return <BarcodeDisplay key={barcode.id} barcode={barcode}></BarcodeDisplay>
            })}
          </ImageList>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleCancel} color="secondary">
          {t('common:cancel')}
        </Button>
        <Button variant="contained" onClick={handleSave}>
          {t('common:save')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

Index.className = 'Settings.Payment.ConfigurePayeeCodeDialog'

export default Index
