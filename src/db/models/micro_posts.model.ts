import { DataTypes } from 'sequelize';
import { db } from '../sequelize';
import { Users } from './users.model';

const Posts = db.define(
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
        post: {
            allowNull: false,
            type: DataTypes.JSONB,
        },
        title: {
            allowNull: false,
            type: DataTypes.STRING,
        },
    },
    {
        tableName: 'post',
    },
);

Posts.belongsTo(Users, {
    foreignKey: 'user_id',
});

export { Posts };
