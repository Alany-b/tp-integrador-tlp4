import { DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from 'sequelize';

// Un permiso tiene la forma "recurso:accion", por ejemplo "event:create"
export class Permission extends Model<InferAttributes<Permission>, InferCreationAttributes<Permission>> {
  declare id: number;    // `declare` avisa a TypeScript que el campo existe sin emitir código
  declare name: string;
}

export function initPermissionModel(sequelize: Sequelize): void {
  Permission.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING(100), allowNull: false, unique: true }, // no se repite
    },
    { sequelize, tableName: 'permissions', timestamps: false } // sin createdAt/updatedAt
  );
}