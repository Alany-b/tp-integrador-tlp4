import {
  BelongsToManySetAssociationsMixin, DataTypes, InferAttributes,
  InferCreationAttributes, Model, NonAttribute, Sequelize,
} from 'sequelize';
import type { Permission } from './Permission'; // solo el tipo, evita dependencia circular en runtime

export class Role extends Model<InferAttributes<Role>, InferCreationAttributes<Role>> {
  declare id: number;
  declare name: string; // 'admin' | 'operador' | 'usuario'

  // Se llena solo cuando hacemos include de la asociación
  declare permissions?: NonAttribute<Permission[]>;

  // Método que Sequelize genera por la asociación belongsToMany; lo declaramos para tiparlo
  declare setPermissions: BelongsToManySetAssociationsMixin<Permission, number>;
}

export function initRoleModel(sequelize: Sequelize): void {
  Role.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    },
    { sequelize, tableName: 'roles', timestamps: false }
  );
}