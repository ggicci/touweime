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
        <Image src={src || '/images/image-placeholder.svg'} alt="barcode" height="400" width="400"></Image>
      </DialogContent>
    </Dialog>
  )
}

export default ImageViewer
