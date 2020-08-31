import { Dialect } from 'sequelize';
const POSTGRES_URI = 'postgres://postgres:postgres@localhost:5432/db_name';

export interface DbConfig {
    client: Dialect;
    connection?: string;
}

export interface Environments {
    [index: string]: DbConfig;
}

const environmentSettings: Environments = {
    development: {
        client: 'postgres',
        connection: process.env.POSTGRES_URI_LOCAL || POSTGRES_URI,
    },
    production: {
        client: 'postgres',
        connection: process.env.POSTGRES_URI,
    },
    test: {
        client: 'postgres',
        connection: process.env.POSTGRES_URI_TEST || POSTGRES_URI,
    },
};

export default environmentSettings;
