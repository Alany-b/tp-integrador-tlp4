import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { apiClient } from "../api/client";
import { session } from "../api/storage";
import { login as loginRequest } from "../api/auth.api";
import { ROLES } from "../types";
import type { Permission, User } from "../types";

interface AuthContextValue {
  user: User | null;
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
  const raw = session.getUser();
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
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedToken = session.getToken();
    const storedUser = readStoredUser();
    if (storedToken !== null && storedUser !== null) {
      setUser(storedUser);
    } else {
      session.clear();
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    function handleUnauthorized(): void {
      setUser(null);
    }
    return apiClient.unauthorized.subscribe(handleUnauthorized);
  }, []);

  async function login(email: string, password: string): Promise<void> {
    const response = await loginRequest({ email, password });
    session.save(response.token, JSON.stringify(response.user));
    setUser(response.user);
  }

  function logout(): void {
    session.clear();
    setUser(null);
  }

  function hasPermission(permission: Permission): boolean {
    if (user === null) {
      return false;
    }
    return user.permissions.includes(permission);
  }

  const value: AuthContextValue = { user, loading, login, logout, hasPermission };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}
