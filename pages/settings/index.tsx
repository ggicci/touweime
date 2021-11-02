import { faAlipay, faWeixin } from '@fortawesome/free-brands-svg-icons'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import Container from '@mui/material/Container'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import { useTheme } from '@mui/material/styles'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import useTranslation from 'next-translate/useTranslation'
import FontAwesomeSvgIcon from 'src/components/FontAwesomeSvgIcon'
import { SettingsRoute } from 'src/routes'

interface PaymentMethod {
  method: 'alipay' | 'wepay'
  descriptionI18nKey: string
}

const Index = () => {
  const { t } = useTranslation('common')
  const theme = useTheme()

  const paymentMethods: PaymentMethod[] = [
    {
      method: 'alipay',
      descriptionI18nKey: 'alipay-promotion',
    },
    {
      method: 'wepay',
      descriptionI18nKey: 'wepay-promotion',
    },
  ]

  return (
    <Container>
      <Stack spacing={2}>
        <Typography variant="h2" sx={{ display: 'flex', alignItems: 'center' }}>
          <FontAwesomeSvgIcon icon={SettingsRoute.icon} fontSize="large"></FontAwesomeSvgIcon>
          {t(SettingsRoute.id)}
        </Typography>

        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <Typography variant="h3">{t('payment-method')}</Typography>
          <Chip
            icon={<FontAwesomeSvgIcon icon={faCheck}></FontAwesomeSvgIcon>}
            label={t('your-page-is-alive')}
            color="success"
          />
        </Stack>

        <List>
          <ListItem>
            <ListItemButton>
              <ListItemAvatar>
                <Avatar variant="square" sx={{ bgcolor: theme.palette.grey[200], width: 48, height: 48 }}>
                  <FontAwesomeSvgIcon icon={faAlipay} fontSize="large" sx={{ color: '#03a1e9' }}></FontAwesomeSvgIcon>
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={t('alipay')} secondary={t('alipay-promotion')}></ListItemText>
              <Switch
                edge="end"
                onChange={handleToggle('wifi')}
                checked={checked.indexOf('wifi') !== -1}
                inputProps={{
                  'aria-labelledby': 'switch-list-label-wifi',
                }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton>
              <ListItemAvatar>
                <Avatar variant="square" sx={{ bgcolor: theme.palette.grey[200], width: 48, height: 48 }}>
                  <FontAwesomeSvgIcon icon={faWeixin} fontSize="large" sx={{ color: '#21ac38' }}></FontAwesomeSvgIcon>
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={t('wepay')} secondary={t('wepay-promotion')}></ListItemText>
            </ListItemButton>
          </ListItem>
        </List>
      </Stack>
    </Container>
  )
}

export default Index
