import { PaletteMode } from '@mui/material'

const DefaultPalette = () => {
  const mode = 'light' as PaletteMode;

  const textColor = '59, 55, 75';  
  return {
    common: {
      black: '#000',
      white: '#FFF',
    },
    mode: mode,
    primary: {
      main: '#008080',  
      contrastText: '#FFF',
    },
    secondary: {
      main: '#051830',  
      contrastText: '#FFF',
    },
    success: {
      light: '#33ddb7',
      main: '#00d5a6',
      dark: '#009574',
      contrastText: '#FFF',
    },
    error: {
      light: '#ff4569',
      main: '#ff1744',
      dark: '#b2102f',
      contrastText: '#FFF',
    },
    warning: {
      light: '#fdc353',
      main: '#FDB528',
      dark: '#b17e1c',
      contrastText: '#FFF',
    },
    info: {
      light: '#33c7cd',
      main: '#00b9c1',
      dark: '#008187',
      contrastText: '#FFF',
    },
    text: {
      primary: `rgba(${textColor}, 0.9)`,
      secondary: `rgba(${textColor}, 0.68)`,
      disabled: `rgba(${textColor}, 0.38)`,
    },
    divider: `rgba(${textColor}, 0.12)`,
    background: {
      paper: mode === 'light' ? '#FFF' : '#010A0F',
      default: '#f1f5f9', 
    },
    action: {
      active: `rgba(${textColor}, 0.54)`,
      hover: `rgba(${textColor}, 0.05)`,
    },
  };
};

export default DefaultPalette;
