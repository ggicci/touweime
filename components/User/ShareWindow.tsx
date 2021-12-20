import { faTwitter, faWeibo } from '@fortawesome/free-brands-svg-icons'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import FontAwesomeSvgIcon from 'components/FontAwesomeSvgIcon'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import { TwitterShareButton, WeiboShareButton } from 'react-share'

export interface Props {
  open: boolean
  onClose: () => void
}

const ShareWindow = (props: Props) => {
  const { open, onClose } = props
  const { t } = useTranslation('common')
  const router = useRouter()
  const shareContent = t('share-window.content')
  const shareURL = `${process.env.NEXT_PUBLIC_HOST}${router.asPath}`

  return (
    <Dialog maxWidth="sm" open={open} onClose={onClose}>
      <Card sx={{ width: 1 }}>
        <CardHeader title={t('share-window.title')}></CardHeader>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {shareContent}
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <TwitterShareButton title={shareContent} url={shareURL}>
            <Button component="a" startIcon={<FontAwesomeSvgIcon icon={faTwitter}></FontAwesomeSvgIcon>}>
              {t('share-window.tweet')}
            </Button>
          </TwitterShareButton>
          <WeiboShareButton title={shareContent} url={shareURL}>
            <Button component="a" startIcon={<FontAwesomeSvgIcon icon={faWeibo}></FontAwesomeSvgIcon>}>
              {t('share-window.weibo')}
            </Button>
          </WeiboShareButton>
        </CardActions>
      </Card>
    </Dialog>
  )
}

export default ShareWindow
