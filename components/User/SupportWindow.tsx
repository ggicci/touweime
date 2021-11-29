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
import TimedButton from 'components/TimedButton'
import { useQRCode } from 'next-qrcode'
import useTranslation from 'next-translate/useTranslation'
import Image from 'next/image'
import { PayeeCode } from 'sdk/settings'
import { getFoodById, SupportIntention } from 'sdk/support'

const PayeeCodeQrCode = ({ text, color }: { text: string; color: string }) => {
  const { inputRef } = useQRCode<HTMLCanvasElement>({
    text: text,
    options: {
      level: 'H',
      width: 240,
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

interface Props {
  intention: SupportIntention | null
  onCancelled: () => void
  onConfirmed: () => void
}

const SupportWindow = (props: Props) => {
  const { intention, onCancelled, onConfirmed } = props
  const theme = useTheme()
  const { t } = useTranslation('common')
  const isSmallerThenMd = useMediaQuery(theme.breakpoints.down('md'))

  if (!intention) {
    return null
  }

  const wepayImage = intention.payment.wepay_payee_code ? (
    <PayeeCodeDisplay code={intention.payment.wepay_payee_code}></PayeeCodeDisplay>
  ) : null

  const alipayImage = intention.payment.alipay_payee_code ? (
    <PayeeCodeDisplay code={intention.payment.alipay_payee_code}></PayeeCodeDisplay>
  ) : null

  const { supportee } = intention
  const food = getFoodById(intention.food_id)
  return (
    <Dialog open={true} maxWidth="md">
      <DialogTitle>
        <Stack direction="row" alignItems="center">
          <Image alt={food.title} src={food.image_url} width={40} height={40}></Image>
          <Typography variant="inherit" sx={{ ml: 1 }}>
            {t('supportWindow.title', { user: supportee.display, food: t(`food.${food.id}`) })}
          </Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack direction={isSmallerThenMd ? 'column' : 'row'} spacing={2} sx={{ justifyContent: 'center' }}>
          {wepayImage}
          {alipayImage}
        </Stack>
        <DialogContentText sx={{ mt: 2 }}>{t('supportWindow.help')}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancelled}>{t('supportWindow.cancel')}</Button>
        <TimedButton variant="contained" enabledAfter={10} onClick={onConfirmed}>
          {/* TODO(ggicci): add a time 10s to enable click */}
          {t('supportWindow.confirm')}
        </TimedButton>
      </DialogActions>
    </Dialog>
  )
}

export default SupportWindow
