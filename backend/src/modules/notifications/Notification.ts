import { DataTypes, Model, Sequelize } from 'sequelize';
import { User } from '../users/User';

export class Notification extends Model {
  declare id: number;
  declare userId: number;
  declare message: string;
  declare read: boolean;
}

export function initNotificationModel(sequelize: Sequelize) {
  Notification.init(
    {
      userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
      message: { type: DataTypes.STRING, allowNull: false },
      read: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    { sequelize, tableName: 'notifications' }
  );
}
