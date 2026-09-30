import { IRoleRepository } from './IRoleRepository';
import { Permission } from './Permission';
import { Role } from './Role';

export class RoleRepository implements IRoleRepository {
  async findById(id: number): Promise<Role | null> {
    return Role.findByPk(id); // null si no existe
  }

  async findByName(name: string): Promise<Role | null> {
    return Role.findOne({ where: { name } });
  }

  async findOrCreateByName(name: string): Promise<Role> {
    const [role] = await Role.findOrCreate({ where: { name } });
    return role;
  }

  async setPermissions(role: Role, permissions: Permission[]): Promise<void> {
    await role.setPermissions(permissions); // reemplaza los permisos del rol por esta lista
  }
}