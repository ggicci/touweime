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
import Image from 'next/image'
import React from 'react'
import { PayeeCodeProfile, PayeeCodeSettings } from 'src/sdk/settings'

const centsToYuan = (price: number) => {
  return `${price / 100}`
}

const PayeeCodeEditor = (props: { barcode: PayeeCodeProfile; open: boolean; onClose: () => void }) => {
  const { barcode, open, onClose } = props

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{centsToYuan(barcode.price_cents)}</DialogTitle>
      <DialogContent>
        <Image src={barcode.url || '/images/image-placeholder.svg'} alt="barcode" height="400" width="400"></Image>
      </DialogContent>
    </Dialog>
  )
}

const PayeeCodeDisplay = (props: { barcode: PayeeCodeProfile }) => {
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
          fontSize: '2rem',
        }}
        onClick={handleClick}
      >
        {centsToYuan(barcode.price_cents)}
      </ButtonBase>
      <ImageListItemBar sx={{ height: 30 }} title="CNY"></ImageListItemBar>

      <PayeeCodeEditor barcode={barcode} open={open} onClose={() => setOpen(false)} />
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
              return <PayeeCodeDisplay key={barcode.id} barcode={barcode}></PayeeCodeDisplay>
            })}
          </ImageList>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>{t('common:cancel')}</Button>
        <Button onClick={handleSave}>{t('common:save')}</Button>
      </DialogActions>
    </Dialog>
  )
}

Index.className = 'Settings.Payment.ConfigurePayeeCodeDialog'

export default Index
