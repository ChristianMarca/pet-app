import jwt from 'jsonwebtoken';
import { getLoginByEmail } from './crud.models/login';
import { Login, Users } from '../db/models';
import { verifyPassword } from '../crypto/crypto';
import { getOneUserByUsernameOnDb } from './crud.models/user';
import { sanitizeOutput } from '../utils/utils';
import { redisClient } from '../db/hashDb/redis';

export interface ILogin {
    email?: string;
    password?: string;
    authorization?: string;
}

export const loginUser = async ({ email, password }: ILogin): Promise<{ [key: string]: string }> => {
    const loginData = await getLoginByEmail(email, Login);

    if (loginData) {
        const loginUserData = loginData.get({ plain: true });
        const isValidPassword = await verifyPassword(password, loginUserData.password);

        if (isValidPassword) {
            const userData = await getOneUserByUsernameOnDb(Users, 'user_id', loginUserData.user_id);
            const userDataSanitized = sanitizeOutput(userData.get({ plain: true }), true);
            return { email, ...userDataSanitized };
        }
    }
    throw { msg: 'Email or password invalid' };
};

const readToken = (token: string): { [p: string]: string } | string => {
    return jwt.decode(token);
};

const signToken = (email: string) => {
    const jwtPayload = { email };
    return jwt.sign(jwtPayload, 'CLAVE_ENV', { expiresIn: '2 days' });
};

const getAuthToken = async ({ authorization }: { authorization: string }) => {
    return new Promise<{ [key: string]: string | boolean }>((resolve, reject) => {
        redisClient.get(authorization, async (err, reply) => {
            if (err || !reply) {
                reject({ status: 400, msg: 'Error on login' });
            }

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const { email = '' } = readToken(authorization);
            const loginData = await getLoginByEmail(email, Login);
            const loginUserData = loginData.get({ plain: true });
            const userData = await getOneUserByUsernameOnDb(Users, 'user_id', loginUserData.user_id);

            reply === '1'
                ? resolve({
                      success: true,
                      token: authorization,
                      ...sanitizeOutput(userData.get({ plain: true }), true),
                  })
                : reject({ status: 400, msg: 'Error on login' });
        });
    });
};

const setToken = (key: string, value: string) => {
    return Promise.resolve(redisClient.set(key, value));
};

// TODO VERIFY CCRF OVER JWT
const createSessions = (user: { [p: string]: string }) => {
    const { email, userId } = user;
    const token = signToken(email);

    return setToken(token, userId)
        .then(() => ({ success: true, userId, token, ...user }))
        .catch((error) => ({ status: 400, msg: error }));
};

export const signAuthentication = async ({
    authorization,
    email,
    password,
}: ILogin): Promise<{ [key: string]: string | boolean | number }> => {
    return authorization
        ? getAuthToken({ authorization })
        : loginUser({ email, password })
              .then((data) =>
                  data.userId && data.email ? createSessions(data) : Promise.reject({ status: 400, ...data }),
              )
              .catch(() => ({ status: 400, msg: 'Error on login' }));
};

export const revokeToken = ({ authorization }: { authorization: string }): Promise<{ [key: string]: string }> => {
    return new Promise((resolve, reject) => {
        redisClient.del(authorization, (err, resp) => {
            if (resp === 1) {
                resolve({ msg: 'Deleted' });
            }
            reject({ msg: 'Fail Delete' });
        });
    });
};
