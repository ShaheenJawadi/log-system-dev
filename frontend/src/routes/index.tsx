import { RouteObject } from "react-router-dom";
import Home from "../pages/home";
import MainPageContainer from "../components/mainPagesContainer";
import NewTrip from "../pages/newTrip";
import DriverLog from "../pages/driverlog";
import LoginPage from "../pages/login";
import RegisterPage from "../pages/register";
import AuthPageHolder from "../components/auth/pageHolder";
import { appPaths } from "./paths";
import AuthRoute from "./authRoute";
import PrivateRoute from "./privateRoute";
import LogsHistory from "../pages/logsHistory";
import TripsHistory from "../pages/tripsHistory";

export const routes: RouteObject[] = [
  {
    path: appPaths.login,
    element: (
      <AuthRoute
        element={
          <AuthPageHolder title={"Login "}>
            <LoginPage />
          </AuthPageHolder>
        }
      />
    ),
  },

  {
    path: appPaths.register,
    element: (
      <AuthRoute
        element={
          <AuthPageHolder title={"Register "}>
            <RegisterPage />
          </AuthPageHolder>
        }
      />
    ),
  },
  {
    path: appPaths.home,
    element: (
      <PrivateRoute
        element={
          <MainPageContainer title="">
            <Home />
          </MainPageContainer>
        }
      />
    ),
  },
  {
    path: appPaths.newTrip,
    element: (
      <PrivateRoute
        element={
          <MainPageContainer title="Plan a Trip">
            <NewTrip />
          </MainPageContainer>
        }
      />
    ),
  },

  {
    path: appPaths.tripsHistory,
    element: (
      <PrivateRoute
        element={
          <MainPageContainer title="Trips History">
            <TripsHistory />
          </MainPageContainer>
        }
      />
    ),
  },
  {
    path: appPaths.logsHistory,
    element: (
      <PrivateRoute
        element={
          <MainPageContainer title="Logs History">
            <LogsHistory />
          </MainPageContainer>
        }
      />
    ),
  },
  {
    path: appPaths.newLog,
    element: (
      <PrivateRoute
        element={
          <MainPageContainer title="Manual Log Entry">
            <DriverLog />
          </MainPageContainer>
        }
      />
    ),
  },
];
