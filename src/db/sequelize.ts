import { Model, ModelCtor, Sequelize, TruncateOptions } from 'sequelize';
import SequelizeConnector from './db.connector';

export interface IDb {
    db: Sequelize;
}

export const db = SequelizeConnector.connection.db;
export const dbForce = SequelizeConnector.getForceConnection.db;

export const truncateModel = (model: ModelCtor<Model>, options: TruncateOptions): (() => Promise<void>) => {
    return (): Promise<void> => model.truncate({ ...options });
};

export const truncateAll = (dbInstance: Sequelize, options: TruncateOptions): (() => Promise<void[]>) => {
    return () => Promise.all(Object.values(dbInstance.models).map((model) => model.truncate({ ...options })));
};
