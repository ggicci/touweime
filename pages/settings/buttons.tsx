import { useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import FoodSelector from 'components/FoodSelector'
import SettingsLayout from 'components/Settings/Layout'
import { toPng } from 'html-to-image'
import { gaiaApi } from 'lib/axios'
import useTranslation from 'next-translate/useTranslation'
import Image from 'next/image'
import React, { useCallback, useRef } from 'react'
import { TwitterPicker } from 'react-color'
import { getFoodById } from 'sdk/support'
import { useLogin } from 'sdk/users'

interface StandardButtonProps {
  style: 'standard'
  food: string
  bgcolor: string
  text: string
}

type CustomButtonPreviewProps = {
  buttonStyle: StandardButtonProps
}

const CustomButtonPreview = React.forwardRef<React.ReactNode, CustomButtonPreviewProps>((props, ref) => {
  const theme = useTheme()
  const { buttonStyle } = props
  const food = getFoodById(buttonStyle.food)

  const icon = <Image alt={food.title} src={food.image_url} width={40} height={40}></Image>
  const text = buttonStyle.text ? (
    <Typography fontSize={28} sx={{ ml: 1 }}>
      {buttonStyle.text}
    </Typography>
  ) : null

  return (
    <Box
      ref={ref}
      sx={{
        display: 'inline-flex',
        px: '1rem',
        color: theme.palette.getContrastText(buttonStyle.bgcolor),
        bgcolor: buttonStyle.bgcolor,
        height: 60,
        maxWidth: '450px',
        borderRadius: '10px',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {icon}
      {text}
    </Box>
  )
})

CustomButtonPreview.displayName = 'CustomButtonPreview'

const Buttons = () => {
  const theme = useTheme()
  const { t } = useTranslation('settings')
  const { data: user } = useLogin()
  const [buttonStyle, setButtonStyle] = React.useState<StandardButtonProps>({
    style: 'standard',
    bgcolor: theme.palette.secondary.main,
    text: t('buttons.default-text', { food: t('common:food.popsicle').toLowerCase() }),
    food: 'popsicle',
  })
  const [buttonUrl, setButtonUrl] = React.useState<string>('')
  const ref = useRef<HTMLDivElement>(null)

  const generatePNG = useCallback(async () => {
    if (ref.current === null) {
      return
    }

    try {
      const dataUrl = await toPng(ref.current, { cacheBust: false })
      // const link = document.createElement('a')
      const blob = await (await fetch(dataUrl)).blob()
      const formData = new FormData()
      formData.append('file', blob, 'button.png')
      const resp = await gaiaApi.post('/v1/buttons', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      const newButtonUrl = `${process.env.NEXT_PUBLIC_GAIA_API_ENDPOINT}${resp.headers['location']}`
      setButtonUrl(newButtonUrl)

      // const md5String = await md5Hex(blob)
      // link.href = dataUrl
      // link.download = 'button.png'
      // link.click()
    } catch (error) {
      console.error(error)
      // FIXME(ggicci): display error
    }
  }, [ref])

  if (!user) return null

  function handleTextChanged(newText: string): void {
    setButtonStyle((prevState) => ({ ...prevState, text: newText }))
  }

  function handleFoodChanged(newFoodId: string): void {
    const newText = t('buttons.default-text', { food: t(`common:food.${newFoodId}`).toLowerCase() })
    setButtonStyle((prevState) => ({ ...prevState, food: newFoodId }))
    handleTextChanged(newText)
  }

  function handleBgcolorChanged(newBgcolor: string): void {
    setButtonStyle((prevState) => ({ ...prevState, bgcolor: newBgcolor }))
  }

  function previewButtonImage() {
    if (buttonUrl) {
      return (
        <Box sx={{ position: 'relative', height: 60 }}>
          <Image alt="preview" src={buttonUrl} layout="fill" objectFit="contain"></Image>
        </Box>
      )
    }
  }

  return (
    <SettingsLayout>
      <Container component={Paper} variant="outlined" sx={{ py: 2 }}>
        <Stack spacing={2}>
          <Card variant="outlined">
            <CardContent sx={{ height: 296, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CustomButtonPreview ref={ref} buttonStyle={buttonStyle}></CustomButtonPreview>
            </CardContent>
            <Divider></Divider>
            <CardActions>
              <Stack spacing={2} width={1}>
                <Stack direction="row" spacing={2}>
                  <FoodSelector
                    variant="button"
                    defaultFoodId={buttonStyle.food}
                    onSelect={(newFood) => handleFoodChanged(newFood.id)}
                  ></FoodSelector>
                  <TextField
                    variant="outlined"
                    label={t('buttons.button-text-input-label')}
                    value={buttonStyle.text}
                    onChange={(e) => handleTextChanged(e.target.value)}
                    sx={{ width: 1 }}
                  ></TextField>
                </Stack>

                <TwitterPicker
                  onChangeComplete={(color) => handleBgcolorChanged(color.hex)}
                  triangle="hide"
                ></TwitterPicker>

                <Button variant="contained" sx={{ width: 1 }} onClick={generatePNG}>
                  {t('buttons.generate-button-url')}
                </Button>
              </Stack>
            </CardActions>
          </Card>

          {/* display button url and allow to copy to clipboard */}
          <Typography variant="h3">{t('buttons.button-url')}</Typography>
          <TextField variant="outlined" aria-readonly value={buttonUrl}></TextField>

          {previewButtonImage()}
        </Stack>
      </Container>
    </SettingsLayout>
  )
}

Buttons.className = 'Settings-Buttons'

export default Buttons
