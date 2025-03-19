import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from "../services/authServices";  

import { ReactNode } from 'react';
import { User } from '../types/auth';
import { getToken, removeToken, setToken } from '../utils/token';
import { appPaths } from '../routes/paths';

const AuthContext = createContext<{
  authToken: string | null,
  user: User | null,
  login: (token: string) => void,
  logout: () => void
}>({
  authToken: null,
  user: null,
  login: (token: string) => {},
  logout: () => {}
});

export const useAuth = () => useContext(AuthContext);


export const AuthProvider = ({ children }: { children: ReactNode }) => { 
  const [authToken, setAuthToken] = useState(getToken() || null);
  const [user, setUser] = useState<User|null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      if (authToken) {
        try {
          const response = await authService.me({ access: authToken });
          setUser(response.user);
        } catch {
          setAuthToken(null);
          setUser(null);
          removeToken();
          navigate(appPaths.login);
        }
      } else {
        setUser(null);
      }
    };

    fetchUser();
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
