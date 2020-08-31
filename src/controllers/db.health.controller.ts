import health from '../db/db.health';
import { db } from '../db/sequelize';
import Responses from './interfaces/responses';

export const dbHealthCheck = (): Promise<Responses> => {
    return health(db);
};
