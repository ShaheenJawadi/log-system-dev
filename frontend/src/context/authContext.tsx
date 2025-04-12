import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as authService from "../services/authServices";

import { ReactNode } from "react";
import { User } from "../types/auth";
import { getRefreshToken, getToken, removeToken, setToken } from "../utils/token";
import { appPaths } from "../routes/paths";
import ServerStatus from "../components/ServerStatus";

const AuthContext = createContext<{
  authToken: string | null;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
}>({
  authToken: null,
  user: null,
  login: (token: string) => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authToken, setAuthToken] = useState(getToken() || null);
  const [user, setUser] = useState<User | null>(null);
  const [isServerSleep, setServerSleep] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      if (authToken) {
        const wakeUpTimeout = setTimeout(() => { 
          setServerSleep(true);
 
        }, 2500);
        try {
          const response = await authService.me({ access: authToken });
          
          setUser(response.user);
        } catch { 
          setAuthToken(null);
          setUser(null);
          removeToken();
          navigate(appPaths.login);
        }finally {
          clearTimeout(wakeUpTimeout);
          setServerSleep(false);
        }
      } else {
        setUser(null);
      }
    };

    fetchUser();
  }, [authToken, navigate]);

  const login = (token: string) => {
    setAuthToken(token);
    setToken(token);
  };

  const logout = async () => {
    
    try {
      await authService.logout();

      setAuthToken(null);
      setUser(null);
      removeToken();
      navigate(appPaths.login);
    } catch (error) {
      console.error("logout failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ authToken, user, login, logout }}>
      <ServerStatus isServerSleep={isServerSleep} />
      {children}
    </AuthContext.Provider>
  );
};
