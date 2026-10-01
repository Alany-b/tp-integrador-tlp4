import { DataTypes, Model, Sequelize } from 'sequelize';
import { Event } from '../events/Event';
import { User } from '../users/User';

export class Subscription extends Model {
  declare id: number;
  declare userId: number;
  declare eventId: number;
}

export function initSubscriptionModel(sequelize: Sequelize) {
  Subscription.init(
    {
      userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
      eventId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Event, key: 'id' } },
    },
    { sequelize, tableName: 'subscriptions' }
  );
}
