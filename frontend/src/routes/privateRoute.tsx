import React from "react";
import { Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const PrivateRoute: React.FC<any> = ({ element, ...rest }) => {
  const { authToken } = useAuth();

  return <>{authToken ? element : <Navigate to="/login" />} </>;
};

export default PrivateRoute;
