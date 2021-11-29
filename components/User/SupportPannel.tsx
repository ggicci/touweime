import { faIceCream } from '@fortawesome/free-solid-svg-icons'
import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Checkbox from '@mui/material/Checkbox'
import Container from '@mui/material/Container'
import FormControlLabel from '@mui/material/FormControlLabel'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import ImageListItemBar from '@mui/material/ImageListItemBar'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import FontAwesomeSvgIcon from 'components/FontAwesomeSvgIcon'
import { centsToYuan } from 'lib/misc'
import useTranslation from 'next-translate/useTranslation'
import Image from 'next/image'
import React from 'react'
import {
  createSupportIntention,
  Food,
  patchSupportIntention,
  SupportIntention,
  SupportIntentionCreationPayload,
  useFoods,
  useUserSupport,
} from 'sdk/support'
import { useLogin } from 'sdk/users'
import SupportWindow from './SupportWindow'
import ThanksWindow from './ThanksWindow'

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

const SupportPannel = (props: { username: string }) => {
  const { username } = props
  const { t } = useTranslation('common')
  const { data: login } = useLogin()
  const { data } = useUserSupport(username)
  const foodList = useFoods()
  const [selectedFood, setSelectedFood] = React.useState<Food>(foodList[0])
  const [message, setMessage] = React.useState('')
  const [sendAsPrivate, setSendAsPrivate] = React.useState(false)
  const [supportIntention, setSupportIntention] = React.useState<SupportIntention | null>(null)
  const [openThanks, setOpenThanks] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  if (!data) {
    return null
  }
  const { user } = data

  function canSupport(): boolean {
    return login?.id != user.id
  }

  async function doSupport() {
    const payload = {
      food_id: selectedFood.id,
      price_cents: selectedFood.price_cents,
      message,
      is_private: sendAsPrivate,
    } as SupportIntentionCreationPayload
    setLoading(true)
    try {
      const { data: intention } = await createSupportIntention(user.username, payload)
      setSupportIntention(intention)
    } catch (error) {
      setLoading(false)
    }
  }

  function afterSupport(intention: SupportIntention) {
    try {
      patchSupportIntention(intention.uuid, { confirmed: true })
    } catch (error) {}
    closeSupportWindow()
    setTimeout(() => {
      setOpenThanks(true)
    }, 1000)
  }

  function closeSupportWindow() {
    setSupportIntention(null)
    setLoading(false)
  }

  return (
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
          <FoodList allFoods={foodList} selected={selectedFood} onSelect={setSelectedFood}></FoodList>
          <SendMessage
            message={message}
            isPrivate={sendAsPrivate}
            onChange={setMessage}
            onTogglePrivate={setSendAsPrivate}
          ></SendMessage>

          <LoadingButton
            variant="contained"
            color="primary"
            sx={{ borderRadius: 5 }}
            onClick={doSupport}
            startIcon={<FontAwesomeSvgIcon icon={faIceCream}></FontAwesomeSvgIcon>}
            disabled={!canSupport()}
            loading={loading}
          >
            {t('supportButton.title', { priceYuan: centsToYuan(selectedFood.price_cents) })}
          </LoadingButton>
        </Stack>
      </CardContent>

      <SupportWindow
        intention={supportIntention}
        onConfirmed={() => afterSupport(supportIntention!)}
        onCancelled={closeSupportWindow}
      ></SupportWindow>

      <ThanksWindow open={openThanks} user={user} thanks={''} onClose={() => setOpenThanks(false)}></ThanksWindow>
    </Container>
  )
}

export default SupportPannel
