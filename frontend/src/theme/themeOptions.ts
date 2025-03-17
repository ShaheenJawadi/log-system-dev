import colorPalette from './pattern/colors' 
import breakpoints from './pattern/breakpoints'
import spacing from './pattern/spacing'
import { createTheme, ThemeOptions } from '@mui/material' 
import Typography from './pattern/typography'
import Overrides from './overrides'
 
 
const themeOptions = (): ThemeOptions => {
  const theme = createTheme({  
    palette: colorPalette(),
    ...spacing,
    breakpoints: breakpoints(),
    shape: {
      borderRadius: 7,
    },
    mixins: {
      toolbar: {
        minHeight: 64,
      },
    },
    typography: Typography(),
    direction: 'ltr',
  });

  return {
    typography: Typography(),
    direction: 'ltr',
    components: Overrides(theme),  
    palette: colorPalette(),
    ...spacing,
    breakpoints: breakpoints(),
    shape: {
      borderRadius: 7,
    },
    mixins: {
      toolbar: {
        minHeight: 64,
      },
    },
  };
};

  

export default themeOptions