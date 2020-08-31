import { Model, ModelCtor } from 'sequelize';
// import { redisClient } from '../../db/hashDb/redis';
import jwt from 'jsonwebtoken';

// const readToken = (token: string): { [p: string]: string } | string => {
//     return jwt.decode(token);
// };

export const getLoginByEmail = async (email: string, loginModel: ModelCtor<Model>): Promise<Model> => {
    return await loginModel.findOne({ where: { email } });
};

// export const getTokenFromDb = (authorization: string) => {
//     return new Promise<{ [key: string]: string | boolean | { [k: string]: string } }>((resolve, reject) => {
//         redisClient.get(authorization, async (err, reply) => {
//             if (err || !reply) {
//                 reject({ msg: 'Token not found' });
//             }
//
//             reply === '1' ? resolve({ data: readToken(authorization) }) : reject({ msg: 'Invalid token' });
//         });
//     });
// };
