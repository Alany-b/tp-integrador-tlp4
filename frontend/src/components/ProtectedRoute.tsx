import { Link, Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";
import type { Permission } from "../types";

interface ProtectedRouteProps {
  permission?: Permission;
}

export function ProtectedRoute({ permission }: ProtectedRouteProps) {
  const { user, loading, hasPermission } = useAuth();

  if (loading) {
    return (
      <main className="page">
        <div className="state state--loading" role="status">
          <div className="state__spinner"></div>
          <p className="state__title">Cargando</p>
          <p className="state__text">Esto puede demorar unos segundos.</p>
        </div>
      </main>
    );
  }

  if (user === null) {
    return <Navigate to="/login" replace />;
  }

  if (permission !== undefined && !hasPermission(permission)) {
    return (
      <main className="page">
        <div className="state state--denied" role="alert">
          <p className="state__title">Acceso denegado</p>
          <p className="state__text">No tenés permisos para ver esta sección.</p>
          <div className="state__actions">
            <Link className="btn btn--secondary btn--small" to="/events">Volver a eventos</Link>
          </div>
        </div>
      </main>
    );
  }

  return <Outlet />;
}
