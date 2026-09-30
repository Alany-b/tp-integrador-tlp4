import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import type { Permission } from "../types";

interface CanProps {
  permission: Permission;
  children: ReactNode;
  mode?: "hide" | "disable";
  fallback?: ReactNode;
}

export function Can({ permission, children, mode = "hide", fallback = null }: CanProps) {
  const { hasPermission } = useAuth();

  if (hasPermission(permission)) {
    return <>{children}</>;
  }

  if (mode === "disable") {
    return (
      <fieldset disabled>
        {children}
      </fieldset>
    );
  }

  return <>{fallback}</>;
}
