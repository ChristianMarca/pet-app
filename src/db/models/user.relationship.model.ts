import { DataTypes } from 'sequelize';
import { db } from '../sequelize';
import { Users, IUserDB } from './users.model';

export interface IUserRelationshipDB {
    _id: number;
    user_id: number;
    followed_user_id: number;
    subscriber?: IUserDB;
    creator?: IUserDB;
}

const RelationShip = db.define(
    'relationship',
    {
        _id: {
            primaryKey: true,
            type: DataTypes.NUMBER,
            allowNull: false,
            autoIncrement: true,
        },
        user_id: {
            references: {
                model: 'users',
                key: 'user_id',
            },
            allowNull: false,
            type: DataTypes.INTEGER,
        },
        followed_user_id: {
            references: {
                model: 'users',
                key: 'user_id',
            },
            allowNull: false,
            type: DataTypes.INTEGER,
        },
    },
    {
        tableName: 'relationship',
    },
);

RelationShip.belongsTo(Users, {
    as: 'creator',
    foreignKey: 'user_id',
});

RelationShip.belongsTo(Users, {
    as: 'subscriber',
    foreignKey: 'followed_user_id',
});

export { RelationShip };
