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

const theme: ThemeOptions = createTheme({
  palette: {
    primary: {
      main: '#161F6D',
    },
    secondary: {
      main: '#00ABE1',
    },
    info: {
      main: '#A6DCEF',
    },
    error: {
      main: '#BE0000',
    },
    success: {
      main: '#66DE93',
    },
    text: {
      primary: '#232323',
    },
    warning: {
      main: '#FFA41B',
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
      fontSize: '1.75rem',
      // color: '#fff',
    },
    h4: {
      fontSize: '1.5rem',
      // color: '#fff',
    },
    h5: {
      fontSize: '1.25rem',
      // color: '#fff',
    },
    h6: {
      fontSize: '1rem',
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
