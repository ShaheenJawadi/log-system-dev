import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from "../services/authServices";  


const AuthContext = createContext<{
  authToken: string | null,
  user: any,
  login: (token: string) => void,
  logout: () => void
}>({
  authToken: null,
  user: null,
  login: (token: string) => {},
  logout: () => {}
});

export const useAuth = () => useContext(AuthContext);

import { ReactNode } from 'react';
import { User } from '../types/auth';
import { removeToken, setToken } from '../utils/token';
import { appPaths } from '../routes/paths';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || null);
  const [user, setUser] = useState<User|null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (authToken) {

         const response =  authService.me({access:authToken}).then(response => {
            setUser(response.user);
          }).catch(() => {
            setAuthToken(null);
            setUser(null);
            removeToken();
            navigate(appPaths.login);
          })
        
   
    } else {
      setUser(null);
    }
  }, [authToken, navigate]);

  const login = (token:string) => {
    setAuthToken(token);
    setToken(token); 
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    removeToken();
    navigate(appPaths.login);
  };

  return (
    <AuthContext.Provider value={{ authToken, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
