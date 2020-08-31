import sequelize, { Sequelize } from 'sequelize';
import { IDb } from './sequelize';
import dbConfig from './db.config';
import { createNamespace } from 'cls-hooked';

const { client, connection } = dbConfig;

class SequelizeConnector implements IDb {
    private static instance: SequelizeConnector;
    public db: Sequelize;

    private constructor() {
        const cls = createNamespace('transaction-namespace');
        Sequelize.useCLS(cls);
        this.db = new sequelize.Sequelize(connection, { dialect: client, define: { timestamps: false } });
    }

    public static get connection(): SequelizeConnector {
        if (!SequelizeConnector.instance) {
            SequelizeConnector.instance = new SequelizeConnector();
        }

        return SequelizeConnector.instance;
    }
    public static get getForceConnection(): SequelizeConnector {
        return new SequelizeConnector();
    }
}

export default SequelizeConnector;
