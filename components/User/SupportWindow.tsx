import { useMediaQuery, useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useQRCode } from 'next-qrcode'
import useTranslation from 'next-translate/useTranslation'
import Image from 'next/image'
import { PayeeCode } from 'sdk/settings'
import { SupportIntention } from 'sdk/support'

interface Props {
  intention: SupportIntention | null
  onClose: () => void
}

const PayeeCodeQrCode = ({ text, color }: { text: string; color: string }) => {
  const { inputRef } = useQRCode<HTMLCanvasElement>({
    text: text,
    options: {
      level: 'H',
      width: 300,
      scale: 1,
      margin: 3,
      color: {
        light: color,
        dark: '#FFF',
      },
    },
  })

  return <canvas ref={inputRef}></canvas>
}

const PayeeCodeDisplay = ({ code }: { code: PayeeCode }) => {
  const { t } = useTranslation('common')
  const title = t(`supportWindow.${code.kind}`)
  const color = code.kind === 'alipay' ? '#1678fe' : '#21ac38'

  let display = null
  if (code.qr_content) {
    display = PayeeCodeQrCode({ text: code.qr_content, color })
  } else {
    display = (
      <Box sx={{ position: 'relative', height: 400, width: 300 }}>
        <Image
          src={code.url || '/images/image-placeholder.svg'}
          alt="barcode"
          layout="fill"
          objectFit="contain"
        ></Image>
      </Box>
    )
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h5" textAlign="center">
        {title}
      </Typography>
      {display}
    </Stack>
  )
}

const SupportWindow = (props: Props) => {
  const { intention, onClose } = props
  const theme = useTheme()
  const { t } = useTranslation('common')
  const isSmallerThenMd = useMediaQuery(theme.breakpoints.down('md'))

  function handleConfirm() {
    onClose()
  }

  if (!intention) {
    return null
  }

  const wepayImage = intention.payment.wepay_payee_code ? (
    <PayeeCodeDisplay code={intention.payment.wepay_payee_code}></PayeeCodeDisplay>
  ) : null

  const alipayImage = intention.payment.alipay_payee_code ? (
    <PayeeCodeDisplay code={intention.payment.alipay_payee_code}></PayeeCodeDisplay>
  ) : null

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md">
      <DialogTitle>{t('supportWindow.title', { username: intention.supportee_id })}</DialogTitle>
      <DialogContent>
        <Stack direction={isSmallerThenMd ? 'column' : 'row'} spacing={2}>
          {wepayImage}
          {alipayImage}
        </Stack>
        <DialogContentText sx={{ mt: 2 }}>{t('supportWindow.help')}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('supportWindow.cancel')}</Button>
        <Button variant="contained" onClick={handleConfirm}>
          {/* TODO(ggicci): add a time 10s to enable click */}
          {t('supportWindow.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SupportWindow
