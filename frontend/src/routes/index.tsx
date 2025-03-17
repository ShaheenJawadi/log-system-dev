import { RouteObject } from "react-router-dom";
import Home from "../pages/home";
import MainPageContainer from "../components/mainPagesContainer";
import NewTrip from "../pages/newTrip";
 

export const routes: RouteObject[] = [
  {
    path: "/",
    element:    <MainPageContainer><Home/></MainPageContainer>,  
  } ,
  {
    path: "/new-trip",
    element:    <MainPageContainer><NewTrip/></MainPageContainer>,  
  } 
  
];
