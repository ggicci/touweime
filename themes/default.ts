// https://next.material-ui.com/customization/palette/#adding-new-colors
// TODO: can move the declarations to @types folder.
declare module '@mui/material/styles' {
  interface Palette {
    github?: Palette['primary']
    apple?: Palette['primary']
  }
  interface PaletteOptions {
    github?: PaletteOptions['primary']
    apple?: PaletteOptions['primary']
  }
}

// Update the Button's color prop options.
declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    github: true
    apple: true
  }
}

declare module '@mui/material/SvgIcon' {
  interface SvgIconPropsColorOverrides {
    github: true
    apple: true
  }
}

import { createTheme, ThemeOptions } from '@mui/material/styles'

// References:
// Blue + White: https://uglydrinks.com/
// Currently used palette: https://colorhunt.co/palette/f4eeffdcd6f7a6b1e1424874
const theme: ThemeOptions = createTheme({
  palette: {
    primary: {
      main: '#424874',
    },
    secondary: {
      main: '#A6B1E1',
    },
    info: {
      main: '#DCD6F7',
    },
    success: {
      main: '#4E9F3D', // https://colorhunt.co/palette/191a191e51284e9f3dd8e9a8
    },
    error: {
      main: '#E02401', // https://colorhunt.co/palette/e02401f78812ab6d2351050f
    },
    warning: {
      main: '#F78812', // https://colorhunt.co/palette/e02401f78812ab6d2351050f
    },
    text: {
      primary: '#1F1D36', // https://colorhunt.co/palette/1f1d363f3351864879e9a6a6
      secondary: '#3F3351', // https://colorhunt.co/palette/1f1d363f3351864879e9a6a6
    },
    background: {
      default: '#F9F5FF', // Lightened version of #F4EEFF from palette: https://colorhunt.co/palette/f4eeffdcd6f7a6b1e1424874
      paper: '#FFF',
    },
    github: {
      main: '#333',
      contrastText: '#fff',
    },
    apple: {
      main: '#000',
      contrastText: '#fff',
    },
  },

  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),

    fontSize: 14, // the font size of MUI

    // NOTE(ggicci): 1rem = 16px (html's default font size, not MUI's)
    // TODO(ggicci): Fluid font size
    // https://github.com/mui-org/material-ui/issues/15251
    h1: {
      fontSize: '2.5rem',
      // color: '#fff',
    },
    h2: {
      fontSize: '2rem',
      // color: '#fff',
    },
    h3: {
      fontSize: '1.875rem',
      // color: '#fff',
    },
    h4: {
      fontSize: '1.75rem',
      // color: '#fff',
    },
    h5: {
      fontSize: '1.5rem',
      // color: '#fff',
    },
    h6: {
      fontSize: '1.25rem',
      // color: '#fff',
    },
  },

  components: {
    // https://next.material-ui.com/components/icons/#font-awesome-2
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          padding: 3,
          transform: 'scale(0.85)',
        },
      },
    },
  },
})

export default theme
