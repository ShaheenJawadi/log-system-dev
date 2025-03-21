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
 

export const routes: RouteObject[] = [

  {
    path: appPaths.login,
    element:<AuthRoute element={<AuthPageHolder title={"Login "}><LoginPage/></AuthPageHolder>} /> ,  
  } 

  ,
  {
    path: appPaths.register,
    element:<AuthRoute element={<AuthPageHolder  title={"Register "}><RegisterPage/></AuthPageHolder>} />,  
  } ,
  {
    path: appPaths.home,
    element:    <PrivateRoute element={<MainPageContainer title=""><Home/></MainPageContainer>} />,  
  } ,
  {
    path: appPaths.newTrip,
    element: <PrivateRoute element={<MainPageContainer title="Plan a Trip"><NewTrip/></MainPageContainer>} />,  
  } 
  ,
  {
    path: appPaths.myLogs,
    element:  <PrivateRoute element={ <MainPageContainer title="Trip History" ><DriverLog/></MainPageContainer>} />,  
  } 


  ,

];
