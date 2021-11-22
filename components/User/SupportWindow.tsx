import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Stack from '@mui/material/Stack'
import Image from 'next/image'
import { SupportIntention } from 'sdk/support'

interface Props {
  intention: SupportIntention | null
  onClose: () => void
}

const SupportWindow = (props: Props) => {
  const { intention, onClose } = props

  if (!intention) {
    return null
  }

  const wepayImage = intention.payment.wepay_payee_code ? (
    <Box sx={{ position: 'relative', height: 400, width: 300 }}>
      <Image
        src={intention.payment.wepay_payee_code.url || '/images/image-placeholder.svg'}
        alt="barcode"
        layout="fill"
        objectFit="contain"
      ></Image>
    </Box>
  ) : null

  const alipayImage = intention.payment.alipay_payee_code ? (
    <Box sx={{ position: 'relative', height: 400, width: 300 }}>
      <Image
        src={intention.payment.alipay_payee_code.url || '/images/image-placeholder.svg'}
        alt="barcode"
        layout="fill"
        objectFit="contain"
      ></Image>
    </Box>
  ) : null

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>{intention.id}</DialogTitle>
      <DialogContent>
        <Stack direction="row" spacing={1}>
          {wepayImage}
          {alipayImage}
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

export default SupportWindow
