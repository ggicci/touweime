import Button from '@mui/material/Button'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent, SelectProps } from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import useTranslation from 'next-translate/useTranslation'
import Image from 'next/image'
import React, { useState } from 'react'
import { ALL_FOODS, Food, getFoodById } from 'sdk/support'

interface ButtonSelectProps {
  food: Food
  onSelect: (id: string) => void
}

const ButtonSelect = (props: ButtonSelectProps) => {
  const { t } = useTranslation('common')
  const { food, onSelect } = props
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget)
  }

  function handleClose() {
    setAnchorEl(null)
  }

  function handleSelect(id: string) {
    onSelect(id)
    handleClose()
  }

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClick}>
        <Image alt={food.title} src={food.image_url} width={32} height={32}></Image>
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {ALL_FOODS.map((food) => (
          <MenuItem key={food.id} value={food.id} onClick={() => handleSelect(food.id)}>
            <ListItemIcon>
              <Image alt={food.title} src={food.image_url} width={32} height={32}></Image>
            </ListItemIcon>
            <ListItemText inset primary={t(`food.${food.id}`)}></ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </React.Fragment>
  )
}

type FoodSelectorProps = Omit<SelectProps, 'variant' | 'onSelect'> & {
  defaultFoodId?: string
  variant?: SelectProps['variant'] | 'button'
  onSelect?: (food: Food) => void
}

const FoodSelector = (props: FoodSelectorProps) => {
  const { t } = useTranslation('common')
  const { defaultFoodId, variant, onSelect } = props
  const [food, setFood] = useState<Food>(defaultFoodId ? getFoodById(defaultFoodId) : ALL_FOODS[0])

  function handleSelect(id: string) {
    const newFood = getFoodById(id)
    setFood(newFood)
    if (onSelect) {
      onSelect(newFood)
    }
  }

  if (variant === 'button') {
    return <ButtonSelect food={food} onSelect={handleSelect}></ButtonSelect>
  }

  function foodName(id: string) {
    return t(`food.${id}`)
  }

  function handleChange(event: SelectChangeEvent) {
    const newFood = getFoodById(event.target.value)
    setFood(newFood)
    if (onSelect) {
      onSelect(newFood)
    }
  }

  return (
    <Select
      value={food.id}
      onChange={handleChange}
      renderValue={(value: string) => {
        return (
          <Stack direction="row" spacing={2}>
            <Image alt={food.title} src={food.image_url} width={20} height={20}></Image>
            <Typography>{foodName(food.id)}</Typography>
          </Stack>
        )
      }}
    >
      {ALL_FOODS.map((food) => (
        <MenuItem key={food.id} value={food.id}>
          <ListItemIcon>
            <Image alt={food.title} src={food.image_url} width={32} height={32}></Image>
          </ListItemIcon>
          <ListItemText inset primary={foodName(food.id)}></ListItemText>
        </MenuItem>
      ))}
    </Select>
  )
}

FoodSelector.className = 'FoodSelector'

export default FoodSelector
