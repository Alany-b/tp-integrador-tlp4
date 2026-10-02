import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import type { Permission } from "../types";

interface CanProps {
  permission: Permission;
  children: ReactNode;
}

export function Can({ permission, children }: CanProps) {
  const { hasPermission } = useAuth();

  if (!hasPermission(permission)) {
    return null;
  }

  return <>{children}</>;
}
