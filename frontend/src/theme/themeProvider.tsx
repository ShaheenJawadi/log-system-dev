import { CssBaseline} from "@mui/material";
import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";
import themeOptions from "./themeOptions";  
import { createTheme } from "@mui/material/styles";
import { ReactNode } from "react";

const AppTheme = ({ children }: { children: ReactNode }) => { 
  const theme = createTheme(themeOptions());
  return (
      <CssVarsProvider theme={theme}>
        <>
          <CssBaseline /> 
          {children}
        </>
      </CssVarsProvider>
  );
};

export default AppTheme;
