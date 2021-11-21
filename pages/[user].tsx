import { faIceCream } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonBase from '@mui/material/ButtonBase'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Checkbox from '@mui/material/Checkbox'
import Container from '@mui/material/Container'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import ImageListItemBar from '@mui/material/ImageListItemBar'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import FontAwesomeSvgIcon from 'components/FontAwesomeSvgIcon'
import DOMPurify from 'dompurify'
import { centsToYuan } from 'lib/misc'
import { marked } from 'marked'
import useTranslation from 'next-translate/useTranslation'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'
import { Settings } from 'sdk/settings'
import { useLogin, User } from 'sdk/users'
import useSWR from 'swr'

const ALL_FOODS: readonly Food[] = [
  { id: 'fried_egg', price_cents: 100, title: 'Fried Egg', image_url: '/images/fried_egg.svg' },
  { id: 'popsicle', price_cents: 500, title: 'Popsicle', image_url: '/images/popsicle.svg' },
  { id: 'chips', price_cents: 1000, title: 'Chips', image_url: '/images/chips.svg' },
  { id: 'doughnut', price_cents: 3000, title: 'Doughnut', image_url: '/images/doughnut.svg' },
  { id: 'pizza', price_cents: 5000, title: 'Pizza', image_url: '/images/pizza.svg' },
  { id: 'lobster', price_cents: 10000, title: 'Lobster', image_url: '/images/lobster.svg' },
]

const Header = (props: UserPageType) => {
  const theme = useTheme()
  const { t } = useTranslation()
  const { user, settings } = props
  return (
    <Paper elevation={0} sx={{ boxShadow: `inset 0px -1px 1px ${theme.palette.grey[300]}` }}>
      <Container sx={{ py: 4 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          {/* avatar */}
          <IconButton>
            <Avatar alt={user.username} src={user.avatar} sx={{ width: 100, height: 100 }}></Avatar>
          </IconButton>
          {/* bio */}
          <Typography variant="h3">
            <Box component="span">{user.display}</Box>
            <Box component="span" sx={{ ml: 1, fontSize: '1.5rem' }}>
              {settings.bio}
            </Box>
          </Typography>
        </Stack>
      </Container>
    </Paper>
  )
}

interface Food {
  id: string
  price_cents: number
  title: string
  image_url: string
}

interface FoodListProps {
  allFoods: readonly Food[]
  selected: Food
  onSelect: (food: Food) => void
}

const FoodList = (props: FoodListProps) => {
  const { t } = useTranslation('common')
  const { allFoods, selected, onSelect } = props

  return (
    <ImageList cols={3}>
      {allFoods.map((food) => {
        return (
          <ImageListItem
            key={food.id}
            sx={{ pt: 1, '&:hover, &.selected': { bgcolor: 'secondary.main' } }}
            component={ButtonBase}
            onClick={() => onSelect(food)}
            className={selected.id === food.id ? 'selected' : ''}
          >
            <Image src={food.image_url} alt={food.title} width={48} height={48}></Image>
            <ImageListItemBar
              title={t(`common:food.${food.id}`) || food.title}
              subtitle={`¥ ${centsToYuan(food.price_cents)}`}
              position="below"
              sx={{ textAlign: 'center' }}
            ></ImageListItemBar>
          </ImageListItem>
        )
      })}
    </ImageList>
  )
}

interface SendMessageProps {
  message: string
  isPrivate: boolean
  onChange: (newValue: string) => void
  onTogglePrivate: (newPrivate: boolean) => void
}

const SendMessage = (props: SendMessageProps) => {
  const { t } = useTranslation('common')
  const { message, isPrivate, onChange, onTogglePrivate } = props

  return (
    <Stack>
      <TextField
        variant="outlined"
        multiline
        rows={3}
        value={message}
        onChange={(e) => onChange(e.target.value)}
        fullWidth
        placeholder={t('common:sendMessage.placeholder')}
      ></TextField>
      <FormControlLabel
        control={<Checkbox checked={isPrivate} onChange={(e) => onTogglePrivate(e.target.checked)}></Checkbox>}
        label={t('common:sendMessage.privateHelp')}
      ></FormControlLabel>
    </Stack>
  )
}

interface UserPageType {
  user: User
  settings: Settings
}

const UserHome = () => {
  const { t } = useTranslation('common')
  const router = useRouter()
  const { data: login } = useLogin()
  const { data } = useSWR<UserPageType>(`/v1/user_pages/${router.query.user}`)
  const [selectedFood, setSelectedFood] = React.useState<Food>(ALL_FOODS[0])
  const [message, setMessage] = React.useState('')
  const [sendAsPrivate, setSendAsPrivate] = React.useState(false)

  if (!data) {
    return null
  }

  const { user, settings } = data

  function canSupport(): boolean {
    return login?.id != user.id
  }

  function doSupport() {}

  const htmlAboutMe = DOMPurify.sanitize(marked.parse(settings.about_me))

  return (
    <React.Fragment>
      <Header {...data}></Header>
      <Container sx={{ py: 3 }}>
        <Grid container spacing={2}>
          <Grid item md={8}>
            <Container component={Paper} variant="outlined" sx={{ py: 2 }}>
              <Typography dangerouslySetInnerHTML={{ __html: htmlAboutMe }}></Typography>
            </Container>
          </Grid>
          <Grid item md={4}>
            <Container component={Card} variant="outlined" disableGutters={true}>
              <CardContent>
                <Stack spacing={2}>
                  <Stack direction="row" sx={{ alignItems: 'center' }}>
                    <Typography fontSize={'1.5rem'}>
                      {t('touwei')}
                      <Box component="span" sx={{ ml: 1, fontSize: '1.25rem' }}>
                        {user.display}
                      </Box>
                    </Typography>
                  </Stack>
                  <FoodList allFoods={ALL_FOODS} selected={selectedFood} onSelect={setSelectedFood}></FoodList>
                  <SendMessage
                    message={message}
                    isPrivate={sendAsPrivate}
                    onChange={setMessage}
                    onTogglePrivate={setSendAsPrivate}
                  ></SendMessage>

                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ borderRadius: 5 }}
                    onClick={doSupport}
                    startIcon={<FontAwesomeSvgIcon icon={faIceCream}></FontAwesomeSvgIcon>}
                    disabled={!canSupport()}
                  >
                    {t('supportButton.title', { priceYuan: centsToYuan(selectedFood.price_cents) })}
                  </Button>
                </Stack>
              </CardContent>
            </Container>
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  )
}

export default UserHome
