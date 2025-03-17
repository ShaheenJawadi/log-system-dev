import { RouteObject } from "react-router-dom";
import Home from "../pages/home";
import MainPageContainer from "../components/mainPagesContainer";
import NewTrip from "../pages/newTrip";
import DriverLog from "../pages/driverlog";
 

export const routes: RouteObject[] = [
  {
    path: "/",
    element:    <MainPageContainer><Home/></MainPageContainer>,  
  } ,
  {
    path: "/new-trip",
    element:    <MainPageContainer><NewTrip/></MainPageContainer>,  
  } 
  ,
  {
    path: "/my-logs",
    element:<MainPageContainer><DriverLog/></MainPageContainer>,  
  } 
];
