import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { getToken, removeToken, setToken, setUnauthorizedHandler } from "../api/client";
import { login as loginRequest } from "../api/auth.api";
import { ROLES } from "../types";
import type { Permission, User } from "../types";

const USER_KEY = "user";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function isUser(value: unknown): value is User {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  if (!("id" in value) || !("email" in value) || !("role" in value) || !("permissions" in value)) {
    return false;
  }
  const id: unknown = value.id;
  const email: unknown = value.email;
  const role: unknown = value.role;
  const permissions: unknown = value.permissions;
  if (typeof id !== "number" && typeof id !== "string") {
    return false;
  }
  if (typeof email !== "string") {
    return false;
  }
  if (typeof role !== "string" || !ROLES.some((validRole) => validRole === role)) {
    return false;
  }
  if (!Array.isArray(permissions)) {
    return false;
  }
  return permissions.every((permission: unknown) => typeof permission === "string");
}

function readStoredUser(): User | null {
  const raw = localStorage.getItem(USER_KEY);
  if (raw === null) {
    return null;
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    if (isUser(parsed)) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedToken = getToken();
    const storedUser = readStoredUser();
    if (storedToken !== null && storedUser !== null) {
      setTokenState(storedToken);
      setUser(storedUser);
    } else {
      removeToken();
      localStorage.removeItem(USER_KEY);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setTokenState(null);
      setUser(null);
    });
  }, []);

  async function login(email: string, password: string): Promise<void> {
    const response = await loginRequest({ email, password });
    setToken(response.token);
    localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    setTokenState(response.token);
    setUser(response.user);
  }

  function logout(): void {
    removeToken();
    localStorage.removeItem(USER_KEY);
    setTokenState(null);
    setUser(null);
  }

  function hasPermission(permission: Permission): boolean {
    if (user === null) {
      return false;
    }
    return user.permissions.includes(permission);
  }

  const value: AuthContextValue = { user, token, loading, login, logout, hasPermission };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}
