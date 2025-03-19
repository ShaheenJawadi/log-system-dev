import { RouteObject } from "react-router-dom";
import Home from "../pages/home";
import MainPageContainer from "../components/mainPagesContainer";
import NewTrip from "../pages/newTrip";
import DriverLog from "../pages/driverlog";
import LoginPage from "../pages/login";
import RegisterPage from "../pages/register";
 

export const routes: RouteObject[] = [

  {
    path: "/login",
    element:<LoginPage/>,  
  } 

  ,
  {
    path: "/register",
    element:<RegisterPage/>,  
  } ,
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


  ,

];
