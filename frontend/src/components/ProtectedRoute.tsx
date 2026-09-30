import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";
import type { Permission } from "../types";

interface ProtectedRouteProps {
  permission?: Permission;
}

export function ProtectedRoute({ permission }: ProtectedRouteProps) {
  const { user, loading, hasPermission } = useAuth();

  if (loading) {
    return <p className="state state--loading">Cargando...</p>;
  }

  if (user === null) {
    return <Navigate to="/login" replace />;
  }

  if (permission !== undefined && !hasPermission(permission)) {
    return <p className="state state--denied">Acceso denegado</p>;
  }

  return <Outlet />;
}
