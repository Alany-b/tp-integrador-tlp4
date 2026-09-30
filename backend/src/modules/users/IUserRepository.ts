import { User } from './User';

// Datos necesarios para crear un usuario (ya con la contraseña hasheada)
export interface CreateUserData {
  name: string;
  email: string;
  passwordHash: string;
  roleId: number;
}

export interface IUserRepository {
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByIdWithPermissions(id: number): Promise<User | null>; // usuario + rol + permisos
  findAll(): Promise<User[]>;
  create(data: CreateUserData): Promise<User>;
  updateRole(user: User, roleId: number): Promise<User>;
}