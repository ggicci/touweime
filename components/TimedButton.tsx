import Button, { ButtonProps } from '@mui/material/Button'
import React from 'react'

export type TimedButtonProps = ButtonProps & {
  enabledAfter?: number
}

const TimedButton = (props: TimedButtonProps) => {
  const { children, enabledAfter, ...rest } = props
  const [countDown, setCountDown] = React.useState(enabledAfter || 0)

  React.useEffect(() => {
    if (countDown > 0) {
      const interval = setInterval(() => {
        setCountDown(countDown - 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [countDown])

  const countDownDisplay = countDown > 0 ? `(${countDown})` : ''

  return (
    <Button {...rest} disabled={countDown > 0}>
      {children} {countDownDisplay}
    </Button>
  )
}

export default TimedButton
