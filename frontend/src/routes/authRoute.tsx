import React from "react";
import { Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { appPaths } from "./paths";

const AuthRoute: React.FC<any> = ({ element, ...rest }) => {
  const { authToken } = useAuth();

  return <>{authToken ? <Navigate to={appPaths.home} /> : element}</>;
};

export default AuthRoute;
