import React from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { routes } from "./routes";
import AppTheme from "./theme/themeProvider";
import "react-perfect-scrollbar/dist/css/styles.css";
import { AuthProvider } from "./context/authContext";
const AppRoutes = () => {
  const routeElements = useRoutes(routes);
  return routeElements;
};

function App() {
  return (
    <AuthProvider>
      <AppTheme>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppTheme>
    </AuthProvider>
  );
}

export default App;
