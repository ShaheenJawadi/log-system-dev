import React from 'react'; 
import { BrowserRouter,  useRoutes } from "react-router-dom";
import { routes } from './routes';


const AppRoutes = () => {
  const routeElements = useRoutes(routes);
  return routeElements;
};

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
