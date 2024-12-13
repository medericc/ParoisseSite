"use client"
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface AuthContextProps {
  isLoggedIn: boolean;
  username: string | null;
  login: (username: string, token: string) => void;
  logout: () => void;
}

// Création du contexte
export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  // Vérifie le token et le username dans le localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");

    if (token && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
  }, []);

  const login = (username: string, token: string) => {
    setIsLoggedIn(true);
    setUsername(username);
    localStorage.setItem("username", username);
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUsername(null);
    localStorage.removeItem("token");
    localStorage.removeItem("username");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour utiliser AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider.");
  }
  return context;
};
