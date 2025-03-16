import React from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { routes } from "./routes";
import AppTheme from "./theme/themeProvider";
import 'react-perfect-scrollbar/dist/css/styles.css';
const AppRoutes = () => {
  const routeElements = useRoutes(routes);
  return routeElements;
};

function App() {
  return (
    <AppTheme>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter> 
    </AppTheme>
  );
}

export default App;
