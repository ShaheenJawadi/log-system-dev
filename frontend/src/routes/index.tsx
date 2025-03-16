import { RouteObject } from "react-router-dom";
import Home from "../pages/home";
import MainPageContainer from "../components/mainPagesContainer";
 

export const routes: RouteObject[] = [
  {
    path: "/",
    element:    <MainPageContainer><Home/></MainPageContainer>,  
  } ,
  {
    path: "/start",
    element:    <MainPageContainer><Home/></MainPageContainer>,  
  } 
  
];
