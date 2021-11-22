import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Image from 'next/image'
import { SupportIntention } from 'sdk/settings'

interface Props {
  intention: SupportIntention | null
  onClose: () => void
}

const SupportWindow = (props: Props) => {
  const { intention, onClose } = props

  if (!intention) {
    return null
  }

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>{intention.id}</DialogTitle>
      <DialogContent>
        <Box sx={{ position: 'relative', height: 400, width: 400 }}>
          <Image
            src={intention.payment.wepay_payee_code?.url || '/images/image-placeholder.svg'}
            alt="barcode"
            layout="fill"
            objectFit="contain"
          ></Image>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default SupportWindow
