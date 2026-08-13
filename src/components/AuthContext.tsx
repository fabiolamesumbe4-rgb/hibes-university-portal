import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
export type UserRole = "Student" | "Professor" | "Admin";


interface AuthState {
  isAuthenticated: boolean;
  userRole: UserRole;
}

interface AuthContextValue extends AuthState {
  setIsAuthenticated: (value: boolean) => void;
  setUserRole: (role: UserRole) => void;
  
  login: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>("Student");

  function login(role: UserRole) {
    setUserRole(role);
    setIsAuthenticated(true);
  }

  function logout() {
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userRole, setIsAuthenticated, setUserRole, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
