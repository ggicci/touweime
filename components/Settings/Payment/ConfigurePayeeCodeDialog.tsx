import { faEye, faUpload } from '@fortawesome/free-solid-svg-icons'
import Backdrop from '@mui/material/Backdrop'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import ImageListItemBar from '@mui/material/ImageListItemBar'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import axios from 'axios'
import FontAwesomeSvgIcon from 'components/FontAwesomeSvgIcon'
import ImageViewer from 'components/ImageViewer'
import { centsToYuan } from 'lib/misc'
import isEmpty from 'lodash/isEmpty'
import useTranslation from 'next-translate/useTranslation'
import { useSnackbar } from 'notistack'
import React from 'react'
import { ValidationError, ValidationErrorResponse } from 'sdk/errors'
import { PayeeCode, PayeeCodeSettings, uploadPayeeCodeImage } from 'sdk/settings'

const i18nKeyPrefix = 'payment.configure-payee-code-dialog'

interface PayeeCodeHoverActionsProps {
  payeeCode: PayeeCode
  onLeave: () => void
  onUploaded: () => void
}

const PayeeCodeHoverActions = (props: PayeeCodeHoverActionsProps) => {
  const { payeeCode, onLeave, onUploaded } = props
  const [openImageViewer, setOpenImageViewer] = React.useState(false)
  const uploaderRef = React.useRef<HTMLInputElement>(null)
  const { t } = useTranslation('settings')
  const { enqueueSnackbar } = useSnackbar()

  function handleUpload() {
    uploaderRef.current?.click()
  }

  function handleView() {
    setOpenImageViewer(true)
  }

  async function handleUploadImage(event: React.ChangeEvent<HTMLInputElement>, payeeCode: PayeeCode) {
    if (isEmpty(event.target.files)) {
      onLeave()
      return // noop
    }

    const file = event.target.files![0]
    try {
      await uploadPayeeCodeImage(payeeCode.id, file)
      onUploaded()
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const resp = error.response
        if (resp && resp.status === 422) {
          const verr = new ValidationError(resp.data as ValidationErrorResponse)
          if (!!verr.getFieldError('qr_content')) {
            enqueueSnackbar(t('invalid-payee-code', { kind: t(payeeCode.kind) }), { variant: 'error' })
          }
        }
      } else {
        enqueueSnackbar(t('common:message.upload-failed'), { variant: 'error' })
      }
    }
  }

  const uploadButton = (
    <Tooltip title={t(`${i18nKeyPrefix}.upload-button`)} placement="top" arrow>
      <IconButton component="a" onClick={handleUpload}>
        <FontAwesomeSvgIcon icon={faUpload} fontSize="small" sx={{ color: 'white' }}></FontAwesomeSvgIcon>
      </IconButton>
    </Tooltip>
  )

  const buttons = [uploadButton]

  if (payeeCode.url) {
    const viewButton = (
      <React.Fragment>
        <Tooltip title={t(`${i18nKeyPrefix}.view-button`)} placement="top" arrow>
          <IconButton component="a" onClick={handleView}>
            <FontAwesomeSvgIcon icon={faEye} fontSize="small" sx={{ color: 'white' }}></FontAwesomeSvgIcon>
          </IconButton>
        </Tooltip>
        <ImageViewer
          title={t(`${i18nKeyPrefix}.viewer-title`, { price: centsToYuan(payeeCode.price_cents) })}
          src={payeeCode.url}
          open={openImageViewer}
          onClose={() => {
            setOpenImageViewer(false)
            onLeave()
          }}
        ></ImageViewer>
      </React.Fragment>
    )

    buttons.unshift(viewButton)
  }

  return (
    <Stack direction="row">
      <Box sx={{ display: { xs: 'none' } }}>
        <input ref={uploaderRef} type="file" accept="image/*" onChange={(e) => handleUploadImage(e, payeeCode)} />
      </Box>
      {buttons.map((button, index) => (
        <React.Fragment key={index}>{button}</React.Fragment>
      ))}
    </Stack>
  )
}

const PayeeCodeBlock = (props: { payeeCode: PayeeCode; onSaved: () => void }) => {
  const { payeeCode, onSaved } = props
  const [show, setShow] = React.useState(false)

  function showActions() {
    setShow(true)
  }

  function hideActions() {
    setShow(false)
  }

  return (
    <ImageListItem>
      <Card
        sx={{
          width: 120,
          height: 120,
          bgcolor: payeeCode.url ? 'success.main' : 'grey.400',
          borderRadius: 0,
        }}
      >
        <CardActionArea onMouseOver={showActions} onMouseOut={hideActions} sx={{ height: '100%' }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography sx={{ fontSize: 32 }}>{centsToYuan(payeeCode.price_cents)}</Typography>
            <Backdrop
              open={show}
              sx={{ position: 'absolute', bgcolor: '#444', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            >
              <PayeeCodeHoverActions payeeCode={payeeCode} onLeave={hideActions} onUploaded={onSaved} />
            </Backdrop>
          </CardContent>
        </CardActionArea>
      </Card>

      <ImageListItemBar sx={{ height: 20 }} subtitle="CNY"></ImageListItemBar>
    </ImageListItem>
  )
}

export type Props = {
  open: boolean
  settings: PayeeCodeSettings
  kind: 'alipay' | 'wepay'
  onClose: () => void
  onSaved: () => void
}

const Index = (props: Props) => {
  const { t } = useTranslation('settings')
  const { open, onClose, onSaved, settings, kind } = props

  return (
    <Dialog maxWidth={false} open={open} scroll="paper">
      <DialogTitle>{t(`${i18nKeyPrefix}.title`, { kind: t(`payment.${kind}`) })}</DialogTitle>
      <DialogContent sx={{ width: 368 }}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end', alignItems: 'center' }}>
            <Box sx={{ color: 'success.main' }}>&#9632;</Box>
            <Box>{t('payment.uploaded')}</Box>
            <Box sx={{ color: 'grey.400' }}>&#9632;</Box>
            <Box>{t('payment.not-uploaded')}</Box>
          </Stack>
          <ImageList cols={3}>
            {settings.codes.map((code) => {
              return <PayeeCodeBlock key={code.id} payeeCode={code} onSaved={onSaved}></PayeeCodeBlock>
            })}
          </ImageList>
          <Typography paragraph>
            {settings.state === 'unprepared'
              ? t(`${i18nKeyPrefix}.upload-help`)
              : t(`${i18nKeyPrefix}.upload-help-done`)}
          </Typography>
          <Typography>{}</Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common:action.close')}</Button>
      </DialogActions>
    </Dialog>
  )
}

Index.className = 'Settings.Payment.ConfigurePayeeCodeDialog'

export default Index
