import { RouteObject } from "react-router-dom";
import Home from "../pages/home";
import MainPageContainer from "../components/mainPagesContainer";
import NewTrip from "../pages/newTrip";
import DriverLog from "../pages/driverlog";
import LoginPage from "../pages/login";
import RegisterPage from "../pages/register";
import AuthPageHolder from "../components/auth/pageHolder";
import { appPaths } from "./paths";
 

export const routes: RouteObject[] = [

  {
    path: appPaths.login,
    element:<AuthPageHolder title={"Login "}><LoginPage/></AuthPageHolder>,  
  } 

  ,
  {
    path: appPaths.register,
    element:<AuthPageHolder  title={"Register "}><RegisterPage/></AuthPageHolder>,  
  } ,
  {
    path: appPaths.home,
    element:    <MainPageContainer><Home/></MainPageContainer>,  
  } ,
  {
    path: appPaths.newTrip,
    element:    <MainPageContainer><NewTrip/></MainPageContainer>,  
  } 
  ,
  {
    path: appPaths.myLogs,
    element:<MainPageContainer><DriverLog/></MainPageContainer>,  
  } 


  ,

];
