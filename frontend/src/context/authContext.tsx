import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import * as authService from "../services/authServices";

import { ReactNode } from "react";
import { User } from "../types/auth";
import {
  getRefreshToken,
  getToken,
  removeToken,
  setToken,
} from "../utils/token";
import { appPaths } from "../routes/paths";
import ServerStatus from "../components/ServerStatus";
import { toast } from "react-toastify";
import { isHosted } from "../utils/checkHost";

const AuthContext = createContext<{
  authToken: string | null;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  setSubmittingAuth:  (isSubmitting: boolean) => void;
}>({
  setSubmittingAuth: () => {},
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
  const [isSubmittingAuth, setSubmittingAuth] = useState<boolean>(false);

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
        } finally {
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
  const toastIdRef = useRef<string | number | null>(null);

  useEffect(() => {
    if (isSubmittingAuth) {
      if (!toast.isActive(toastIdRef.current as string | number) && isHosted()) {
        toastIdRef.current = toast.warning(
          "⏳ Since this demo is hosted on Render’s free tier, it may take a few extra seconds to respond if it's waking up.",
          { autoClose: false }
        );
      }
    } else {
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
        toastIdRef.current = null;
      }
    }
  }, [isSubmittingAuth]);


  return (
    <AuthContext.Provider
      value={{ authToken, user, login, logout, setSubmittingAuth }}
    >
      <ServerStatus isServerSleep={isServerSleep && isHosted()} />
      {children}
    </AuthContext.Provider>
  );
};
