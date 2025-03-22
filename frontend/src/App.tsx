import React from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { routes } from "./routes";
import AppTheme from "./theme/themeProvider";
import "react-perfect-scrollbar/dist/css/styles.css";
import { AuthProvider } from "./context/authContext";
import { MapUtilsProvider } from "./context/mapContext";
import { DialogProvider } from "./context/dialogContext";
const AppRoutes = () => {
  const routeElements = useRoutes(routes);
  return routeElements;
};

function App() {
  return (
    <AppTheme>
      <BrowserRouter>
        <AuthProvider>
          <DialogProvider>
            <MapUtilsProvider>
              <AppRoutes />
            </MapUtilsProvider>
          </DialogProvider>
        </AuthProvider>
      </BrowserRouter>
    </AppTheme>
  );
}

export default App;
