import Button, { ButtonProps } from '@mui/material/Button'
import React from 'react'

export type DoubleFacedButtonProps = ButtonProps & {
  hoverChildren?: React.ReactNode
  hoverStartIcon?: React.ReactNode
  hoverColor?: ButtonProps['color']
}

const DoubleFacedButton = (props: DoubleFacedButtonProps) => {
  const {
    children: initChildren,
    hoverChildren,
    color: initColor,
    hoverColor,
    startIcon: initStartIcon,
    hoverStartIcon,
    ...rest
  } = props
  const [children, setChildren] = React.useState<React.ReactNode>(initChildren)
  const [color, setColor] = React.useState<ButtonProps['color']>(initColor)
  const [startIcon, setStartIcon] = React.useState<React.ReactNode>(initStartIcon)

  return (
    <Button
      onMouseEnter={() => {
        setChildren(hoverChildren || initChildren)
        setColor(hoverColor || initColor)
        setStartIcon(hoverStartIcon || initStartIcon)
      }}
      onMouseLeave={() => {
        setChildren(initChildren)
        setColor(initColor)
        setStartIcon(initStartIcon)
      }}
      color={color}
      startIcon={startIcon}
      {...rest}
    >
      {children}
    </Button>
  )
}

export default DoubleFacedButton
