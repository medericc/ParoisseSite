"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface AuthContextProps {
  isLoggedIn: boolean;
  username: string | null;
  userRole: string | null; // Ajout de userRole
  login: (username: string, token: string, role: string) => void;
  logout: () => void;
}

// Création du contexte
export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null); // Ajout de userRole

  // Vérifie le token, le username et le rôle dans le localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    const storedRole = localStorage.getItem("userRole");

    if (token && storedUsername && storedRole) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
      setUserRole(storedRole); // Récupération du rôle
    }
  }, []);

  const login = (username: string, token: string, role: string) => {
    setIsLoggedIn(true);
    setUsername(username);
    setUserRole(role); // Mise à jour du rôle
    localStorage.setItem("username", username);
    localStorage.setItem("token", token);
    localStorage.setItem("userRole", role); // Stockage du rôle
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUsername(null);
    setUserRole(null); // Réinitialisation du rôle
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userRole"); // Suppression du rôle
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, userRole, login, logout }}>
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
