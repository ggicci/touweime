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

const theme: ThemeOptions = createTheme({
  palette: {
    // primary: {
    //   main: '#4F81C7',
    // },
    // secondary: {
    //   main: '#64C4ED',
    // },
    // info: {
    //   main: '#64C4ED',
    // },
    // error: {
    //   main: '#EB7070',
    // },
    // success: {
    //   main: '#64E291',
    // },
    // text: {
    //   primary: '#222831',
    // },
    // warning: {
    //   main: '#FEC771',
    // },
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
      fontSize: '2rem',
    },
    h2: {
      fontSize: '1.75rem',
    },
    h3: {
      fontSize: '1.5rem',
    },
    h4: {
      fontSize: '1.375rem',
    },
    h5: {
      fontSize: '1.25rem',
    },
    h6: {
      fontSize: '1.125rem',
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
