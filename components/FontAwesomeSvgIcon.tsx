import { IconDefinition } from '@fortawesome/fontawesome-common-types'
import { FontAwesomeIconProps } from '@fortawesome/react-fontawesome'
import { SvgIcon, SvgIconProps } from '@mui/material'
import React from 'react'

export type FontAwesomeSvgIconProps = SvgIconProps & FontAwesomeIconProps

const FontAwesomeSvgIcon = React.forwardRef<SVGSVGElement, FontAwesomeSvgIconProps>((props, ref) => {
  const { icon } = props

  const {
    icon: [width, height, , , svgPathData],
  } = icon as IconDefinition

  const muiSvgIconProps = props as SvgIconProps

  return (
    <SvgIcon ref={ref} viewBox={`0 0 ${width} ${height}`} {...muiSvgIconProps}>
      {typeof svgPathData === 'string' ? (
        <path d={svgPathData} />
      ) : (
        /**
         * A multi-path Font Awesome icon seems to imply a duotune icon.
         */
        svgPathData.map((d: string, i: number) => <path key={i} style={{ opacity: i === 0 ? 0.4 : 1 }} d={d} />)
      )}
    </SvgIcon>
  )
})

FontAwesomeSvgIcon.displayName = 'FontAwesomeSvgIcon'

export default FontAwesomeSvgIcon
