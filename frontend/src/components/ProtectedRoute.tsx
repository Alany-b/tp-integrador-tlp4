import { Link, Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";
import type { Permission } from "../types";
import { StateMessage } from "./StateMessage";

interface ProtectedRouteProps {
  permission?: Permission;
}

export function ProtectedRoute({ permission }: ProtectedRouteProps) {
  const { user, loading, hasPermission } = useAuth();

  if (loading) {
    return (
      <main className="page">
        <StateMessage variant="loading" title="Cargando" />
      </main>
    );
  }

  if (user === null) {
    return <Navigate to="/login" replace />;
  }

  if (permission !== undefined && !hasPermission(permission)) {
    return (
      <main className="page">
        <StateMessage variant="denied" title="Acceso denegado" text="No tenés permisos para ver esta sección.">
          <Link className="btn btn--secondary btn--small" to="/events">Volver a eventos</Link>
        </StateMessage>
      </main>
    );
  }

  return <Outlet />;
}
