import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      light: 'rgb(194,224,253)',
      main: 'rgb(43,154,255)',
      dark: 'rgb(0 110 208)',
    },
    secondary: {
      light: '#5a5a5a',
      main: '#2c2c2c',
      dark: '#1e1e1e',
    },
    background: {
      light: '#f5f5f5',
      main: '#fff',
      dark: '#333',
      default: 'rgba(253,253,253,0.89)',
    },
    border: {
      light: '#eaeaea',
      main: '#ccc',
      dark: '#333',
    },
    text: {
      primary: '#333',
      light: '#666',
      secondary: '#009adb',
      contrast: '#fff',
    },
  },
});

export default theme;
