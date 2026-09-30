import { Permission } from './Permission';

export interface IPermissionRepository {
  findOrCreateByName(name: string): Promise<Permission>;
}