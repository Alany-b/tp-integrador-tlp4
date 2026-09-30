// Nombres de roles: un solo lugar, sin strings sueltos por el código
export const ROLES = {
  ADMIN: 'admin',
  OPERADOR: 'operador',
  USUARIO: 'usuario',
} as const; // as const: los valores son literales, no string genérico

// Nombres de permisos con el formato recurso:accion
export const PERMISSIONS = {
  EVENT_READ: 'event:read',
  EVENT_CREATE: 'event:create',
  EVENT_UPDATE: 'event:update',
  EVENT_CHANGE_STATUS: 'event:change-status',
  EVENT_DELETE: 'event:delete',
  SUBSCRIPTION_CREATE: 'subscription:create',
  SUBSCRIPTION_DELETE: 'subscription:delete',
  NOTIFICATION_READ: 'notification:read',
  USER_READ: 'user:read',
  USER_ASSIGN_ROLE: 'user:assign-role',
} as const;

// Tipos derivados: "cualquiera de los valores de PERMISSIONS" / "de ROLES"
export type RoleName = (typeof ROLES)[keyof typeof ROLES];
export type PermissionName = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// La tabla de la consigna, traducida a datos: qué permisos tiene cada rol
export const ROLE_PERMISSIONS: Record<RoleName, readonly PermissionName[]> = {
  [ROLES.ADMIN]: Object.values(PERMISSIONS), // el admin tiene todos
  [ROLES.OPERADOR]: [
    PERMISSIONS.EVENT_READ,
    PERMISSIONS.EVENT_CREATE,
    PERMISSIONS.EVENT_UPDATE,
    PERMISSIONS.EVENT_CHANGE_STATUS,
    PERMISSIONS.SUBSCRIPTION_CREATE,
    PERMISSIONS.SUBSCRIPTION_DELETE,
    PERMISSIONS.NOTIFICATION_READ,
  ],
  [ROLES.USUARIO]: [
    PERMISSIONS.EVENT_READ,
    PERMISSIONS.SUBSCRIPTION_CREATE,
    PERMISSIONS.SUBSCRIPTION_DELETE,
    PERMISSIONS.NOTIFICATION_READ,
  ],
};