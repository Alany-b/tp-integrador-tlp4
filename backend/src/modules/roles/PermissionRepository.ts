import { IPermissionRepository } from './IPermissionRepository';
import { Permission } from './Permission';

export class PermissionRepository implements IPermissionRepository {
  async findOrCreateByName(name: string): Promise<Permission> {
    // findOrCreate devuelve [instancia, seCreó]; nos quedamos con la instancia
    const [permission] = await Permission.findOrCreate({ where: { name } });
    return permission;
  }
}