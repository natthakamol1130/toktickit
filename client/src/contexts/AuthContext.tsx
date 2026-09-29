import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../types";
import { loginApi, changePasswordApi, getMeApi, logoutApi } from "../api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("toktickit_token"));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem("toktickit_token");
      if (savedToken) {
        try {
          const userData = await getMeApi(savedToken);
          setUser(userData);
          setToken(savedToken);
        } catch (e) {
          localStorage.removeItem("toktickit_token");
          localStorage.removeItem("toktickit_user");
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const data = await loginApi(email, password);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("toktickit_token", data.token);
    localStorage.setItem("toktickit_user", JSON.stringify(data.user));
    return data.user;
  };

  const logout = () => {
    if (token) {
      logoutApi(token);
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem("toktickit_token");
    localStorage.removeItem("toktickit_user");
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!token) throw new Error("Not authenticated");
    await changePasswordApi(token, currentPassword, newPassword);
    if (user) {
      const updatedUser = { ...user, mustChangePassword: false };
      setUser(updatedUser);
      localStorage.setItem("toktickit_user", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, logout, changePassword, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
