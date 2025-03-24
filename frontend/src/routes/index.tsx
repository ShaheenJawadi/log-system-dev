import { RouteObject } from "react-router-dom";
import Home from "../pages/home";
import MainPageContainer from "../components/mainPagesContainer";
import NewTrip from "../pages/trips/newTrip";
import DriverLog from "../pages/logs/driverlog";
import LoginPage from "../pages/auth/login";
import RegisterPage from "../pages/auth/register";
import AuthPageHolder from "../components/auth/pageHolder";
import { appPaths } from "./paths";
import AuthRoute from "./authRoute";
import PrivateRoute from "./privateRoute";
import LogsHistory from "../pages/logs/logsHistory";
import TripsHistory from "../pages/trips/tripsHistory";
import TripOverView from "../pages/trips/TripOverview";
import ELDEntryForm from "../pages/logs/manual";

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
           <ELDEntryForm isUpdate={false} />
          </MainPageContainer>
        }
      />
    ),
  },
  {
    path: appPaths.updateLog,
    element: (
      <PrivateRoute
        element={
          <MainPageContainer title="Manual Log Entry">
           <ELDEntryForm isUpdate={true} />
          </MainPageContainer>
        }
      />
    ),
  },
  {
    path: appPaths.singleLog,
    element: (
      <PrivateRoute
        element={
          <MainPageContainer title="Log preview">
            <DriverLog />  
          </MainPageContainer>
        }
      />
    ),
  },
  {
    path: appPaths.singleTrip,
    element: (
      <PrivateRoute
        element={
          <MainPageContainer title="Trip Details">
            <TripOverView />
          </MainPageContainer>
        }
      />
    ),
  },
];
