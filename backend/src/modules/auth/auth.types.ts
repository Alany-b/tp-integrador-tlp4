export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

// Lo que devolvemos del usuario: sin passwordHash
export interface AuthenticatedUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface AuthResult {
  token: string;
  user: AuthenticatedUser;
}

export interface AuthenticatedUser {
  id: number;
  name: string;
  email: string;
  role: string;
  permissions: string[]; // ej: ['event:read', 'event:create', ...]
}