import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Image from 'next/image'

const ImageViewer = (props: { title: string; src: string; open: boolean; onClose: () => void }) => {
  const { title, src, open, onClose } = props

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ position: 'relative', height: 400, width: 400 }}>
          <Image src={src || '/images/image-placeholder.svg'} alt="barcode" layout="fill" objectFit="contain"></Image>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default ImageViewer
