import {
  CreationOptional, DataTypes, ForeignKey, InferAttributes,
  InferCreationAttributes, Model, NonAttribute, Sequelize,
} from 'sequelize';
import type { Role } from '../roles/Role';

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;    
  declare name: string;
  declare email: string;
  declare passwordHash: string;            
  declare roleId: ForeignKey<number>;      
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>;

  declare role?: NonAttribute<Role>;       
}

export function initUserModel(sequelize: Sequelize): void {
  User.init(
    {
      id: {
        
        type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

      name: { 
        
        type: DataTypes.STRING(100), allowNull: false },

      email: {

         type: DataTypes.STRING(150), allowNull: false, unique: true },

      passwordHash: { 
        
        type: DataTypes.STRING, allowNull: false },

      roleId: { 
        
        type: DataTypes.INTEGER, allowNull: false },

      createdAt: DataTypes.DATE,

      updatedAt: DataTypes.DATE,
    },
    {
       sequelize, tableName: 'users' }
  );
}