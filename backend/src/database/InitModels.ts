import { Sequelize } from 'sequelize';
import { Permission, initPermissionModel } from '../modules/roles/Permission';
import { Role, initRoleModel } from '../modules/roles/Role';
import { User, initUserModel } from '../modules/users/User';
import { initEventModel } from '../modules/events/Event';

export function initModels(sequelize: Sequelize): void {
  // 1) Primero se inicializan todos los modelos con la instancia única de Sequelize
  initPermissionModel(sequelize);
  initRoleModel(sequelize);
  initUserModel(sequelize);
  initEventModel(sequelize);

  // 2) Después se declaran las asociaciones
  // Rol <-> Permiso: muchos a muchos, con la tabla intermedia role_permissions
  Role.belongsToMany(Permission, {
    through: 'role_permissions', as: 'permissions',
    foreignKey: 'roleId', otherKey: 'permissionId', timestamps: false,
  });
  Permission.belongsToMany(Role, {
    through: 'role_permissions', as: 'roles',
    foreignKey: 'permissionId', otherKey: 'roleId', timestamps: false,
  });

  // Rol -> Usuarios: un rol tiene muchos usuarios y cada usuario tiene un rol
  Role.hasMany(User, { foreignKey: 'roleId', as: 'users' });
  User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });

  // Los modelos de la otra persona (Event, Subscription, Notification) se suman acá en el Hito 5
}