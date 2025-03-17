import { CssBaseline} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import themeOptions from "./themeOptions";  
import { createTheme } from "@mui/material/styles";
import { ReactNode } from "react";

const AppTheme = ({ children }: { children: ReactNode }) => { 
  const theme = createTheme(themeOptions());
  return (
      <ThemeProvider theme={theme}>
        <>
          <CssBaseline /> 
          {children}
        </>
      </ThemeProvider>
  );
};

export default AppTheme;
