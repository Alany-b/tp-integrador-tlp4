import { IPasswordHasher } from '../modules/auth/IPasswordHasher';
import { IPermissionRepository } from '../modules/roles/IPermissionRepository';
import { IRoleRepository } from '../modules/roles/IRoleRepository';
import { Permission } from '../modules/roles/Permission';
import { PERMISSIONS, PermissionName, ROLE_PERMISSIONS, ROLES, RoleName } from '../modules/roles/permissions';
import { IUserRepository } from '../modules/users/IUserRepository';

// Usuarios de prueba que exige la consigna (van también en el README)
const TEST_USERS: ReadonlyArray<{ name: string; email: string; password: string; role: RoleName }> = [
  { name: 'Administrador', email: 'admin@tp.com', password: 'admin123', role: ROLES.ADMIN },
  { name: 'Administrador 2', email: 'admin2@tp.com', password: 'admin2123', role: ROLES.ADMIN },
  { name: 'Operador', email: 'operador@tp.com', password: 'operador123', role: ROLES.OPERADOR },
  { name: 'Usuario', email: 'usuario@tp.com', password: 'usuario123', role: ROLES.USUARIO },
];

export class DatabaseSeeder {
  // Todas las dependencias son interfaces, inyectadas por constructor
  constructor(
    private readonly roles: IRoleRepository,
    private readonly permissions: IPermissionRepository,
    private readonly users: IUserRepository,
    private readonly hasher: IPasswordHasher
  ) {}

  // Es idempotente: se puede ejecutar en cada arranque sin duplicar datos
  async run(): Promise<void> {
    const permissionsByName = await this.seedPermissions();
    await this.seedRoles(permissionsByName);
    await this.seedUsers();
    console.log('[Seed] Roles, permisos y usuarios de prueba cargados');
  }

  // 1) Crea cada permiso y devuelve un mapa nombre -> permiso
  private async seedPermissions(): Promise<Map<PermissionName, Permission>> {
    const map = new Map<PermissionName, Permission>();
    for (const name of Object.values(PERMISSIONS)) {
      map.set(name, await this.permissions.findOrCreateByName(name));
    }
    return map;
  }

  // 2) Crea cada rol y le asigna sus permisos según ROLE_PERMISSIONS
  private async seedRoles(permissionsByName: Map<PermissionName, Permission>): Promise<void> {
    for (const roleName of Object.values(ROLES)) {
      const role = await this.roles.findOrCreateByName(roleName);
      const rolePermissions = ROLE_PERMISSIONS[roleName].map((permissionName) => {
        const permission = permissionsByName.get(permissionName);
        if (permission === undefined) {
          throw new Error(`Permiso no cargado en el seed: ${permissionName}`);
        }
        return permission;
      });
      await this.roles.setPermissions(role, rolePermissions);
    }
  }

  // 3) Crea los usuarios de prueba solo si todavía no existen
  private async seedUsers(): Promise<void> {
    for (const testUser of TEST_USERS) {
      const exists = await this.users.findByEmail(testUser.email);
      if (exists !== null) continue; // ya estaba: no lo tocamos
      const role = await this.roles.findByName(testUser.role);
      if (role === null) {
        throw new Error(`Rol no cargado en el seed: ${testUser.role}`);
      }
      await this.users.create({
        name: testUser.name,
        email: testUser.email,
        passwordHash: await this.hasher.hash(testUser.password), // nunca guardamos el texto plano
        roleId: role.id,
      });
    }
  }
}