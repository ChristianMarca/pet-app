import { DataTypes, Sequelize } from 'sequelize';
import { db } from '../sequelize';

export interface IUserDB {
    user_id?: string;
    username: string;
    name: string;
    last_name: string;
    created_at: string;
    updated_at?: string;
}

export interface IUserCountDB {
    last_name?: string;
    n_times: string;
}

const Users = db.define('users', {
    user_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    username: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    name: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    last_name: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    created_at: {
        allowNull: false,
        type: DataTypes.TIME,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updated_at: {
        allowNull: false,
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
});

export { Users };
