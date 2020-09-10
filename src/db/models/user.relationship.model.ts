import { DataTypes } from 'sequelize';
import { db } from '../sequelize';
import { Users } from './users.model';

const RelationShip = db.define(
    'posts',
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
        tableName: 'post',
    },
);

RelationShip.belongsTo(Users, {
    foreignKey: 'user_id',
});

RelationShip.belongsTo(Users, {
    foreignKey: 'followed_user_id',
});

export { RelationShip };
