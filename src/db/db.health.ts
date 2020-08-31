import { Sequelize } from 'sequelize';
import Responses from '../controllers/interfaces/responses';

const health = (db: Sequelize): Promise<Responses> => {
    return db
        .authenticate()
        .then(() => {
            const successful: Responses = { msg: 'Connection has been established successfully.' };
            return successful;
        })
        .catch((error) => {
            const errorMessage: Responses = { error };
            return errorMessage;
        });
};

export default health;
