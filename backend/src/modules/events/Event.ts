import { DataTypes, Model, Sequelize } from 'sequelize';

export class Event extends Model {
  declare id: number;
  declare title: string;
  declare description: string;
  declare status: string;
}

export function initEventModel(sequelize: Sequelize) {
  Event.init(
    {
      title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.STRING, allowNull: false },
      status: { type: DataTypes.STRING, defaultValue: 'PROGRAMADO' },
    },
    { sequelize, tableName: 'events' }
  );
}