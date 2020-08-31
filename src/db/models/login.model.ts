import { DataTypes } from 'sequelize';
import { db } from '../sequelize';
import { Users } from './users.model';

const Login = db.define(
    'login',
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
        email: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        password: {
            allowNull: false,
            type: DataTypes.STRING,
        },
    },
    {
        tableName: 'login',
    },
);

Login.belongsTo(Users, {
    foreignKey: 'user_id',
});

export { Login };
