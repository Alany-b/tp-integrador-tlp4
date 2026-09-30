import { Permission } from './Permission';
import { Role } from './Role';

export interface IRoleRepository {
  findById(id: number): Promise<Role | null>;
  findByName(name: string): Promise<Role | null>;
  findOrCreateByName(name: string): Promise<Role>;
  setPermissions(role: Role, permissions: Permission[]): Promise<void>;
}