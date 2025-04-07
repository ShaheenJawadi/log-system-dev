import { CssBaseline} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import themeOptions from "./themeOptions";  
import { createTheme } from "@mui/material/styles";
import { ReactNode } from "react";
import { ToastContainer } from "react-toastify";

const AppTheme = ({ children }: { children: ReactNode }) => { 
  const theme = createTheme(themeOptions());
  return (
      <ThemeProvider theme={theme}>
        <>
          <CssBaseline /> 
          <ToastContainer />
          {children} 
        </>
      </ThemeProvider>
  );
};

export default AppTheme;
