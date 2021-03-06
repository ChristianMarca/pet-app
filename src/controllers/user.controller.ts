import { OrderItem, Model, ModelAttributes } from 'sequelize';
import {
    createUserOnDB,
    getGroupCountUsersByUsernameOnDb,
    getOneUserByUsernameOnDb,
    getUsersByUsernameOnDb,
    getUsersOnDb,
    getUsersSortedByFieldOnDb,
    createNewLoginUser,
    updateUserOnDB,
    getUserByCustomParameters,
    deleteUserByUserIdOnDb,
} from './crud.models/user';
import { deleteLoginByUserIdDb } from './crud.models/login';
import { ILogin } from './login.controller';
import { Users } from '../db/models/users.model';
import { Login } from '../db/models';
import { filterValuesOnObject, sanitizeOutput, sanitizeOutputCounter } from '../utils/utils';
import { db } from '../db/sequelize';
import { validateEmail } from './utils/login.utils';
import { encryptPassword } from '../crypto/crypto';

type sortTypeValues = 'ASC' | 'DESC';

export type SortType = {
    name?: sortTypeValues;
    lastName?: sortTypeValues;
};

export type PaginationRequest = {
    pageNumber?: number;
    pageSize?: number;
};

export interface IUserGetAll extends SortType, PaginationRequest {}

export type LastNameQueryParams = {
    lastName?: string | string[];
};

export interface IUserData {
    userId?: string;
    username: string;
    name: string;
    lastName: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface IUserLogin extends IUserData, ILogin {
    userId?: string;
}

export interface IUserResponse extends IUserLogin {
    status?: string;
}

export interface IUserDataCounter {
    lastName?: string;
    nTimes: string;
}

export interface PaginationResponse {
    pagination: { [key: string]: number };
    users: IUserData[];
}

export const createUser = (user: IUserLogin): Promise<IUserData> => {
    const { email, password } = user;
    return db.transaction(async (trx) => {
        try {
            const isValidEmail = validateEmail(email);

            if (!isValidEmail) {
                throw { msg: 'Invalid email' };
            }

            const passwordHash = await encryptPassword(password);

            const userCreated: Model = await createUserOnDB(user, Users);
            const userData = sanitizeOutput(userCreated.get({ plain: true }), true);
            await createNewLoginUser({ email, password: passwordHash, ...userData }, Login);

            return userData;
        } catch (error) {
            await trx.rollback();
            return error;
        }
    });
};

export const updateUser = (newUserData: Partial<Pick<IUserData, 'username' | 'name' | 'lastName'>>, userId: string) => {
    return db.transaction(async (trx) => {
        try {
            const [changesNumber, userChange]: [number, Model<ModelAttributes>[]] = await updateUserOnDB(
                filterValuesOnObject(newUserData, ['string']),
                userId,
                Users,
            );

            return changesNumber && userChange.length
                ? userChange[0].get({ plain: true })
                : { msg: 'cannot update user', status: 400 };
        } catch (error) {
            await trx.rollback();
            return error;
        }
    });
};

export const getUserByUsername = async (username: string): Promise<IUserData | Partial<IUserData>> => {
    const user = await getOneUserByUsernameOnDb(Users, 'username', username);
    return user ? sanitizeOutput(user.get({ plain: true }), true) : {};
};

export const getUsers = async ({
    name,
    lastName,
    pageNumber = 1,
    pageSize = 10,
}: IUserGetAll): Promise<PaginationResponse> => {
    const sortItems: OrderItem[] = [];
    if (name) {
        sortItems.push(['name', name]);
    }
    if (lastName) {
        sortItems.push(['last_name', lastName]);
    }

    if (!sortItems.length) {
        sortItems.push(['user_id', 'ASC']);
    }

    const paginationData = {
        pageNumber: typeof pageNumber === 'string' ? parseInt(pageNumber, 10) : pageNumber,
        pageSize: typeof pageSize === 'string' ? parseInt(pageSize, 10) : pageSize,
    };

    const userList: { [key: string]: any } = sortItems.length
        ? await getUsersSortedByFieldOnDb(Users, sortItems, paginationData.pageNumber, paginationData.pageSize)
        : await getUsersOnDb(Users, paginationData.pageNumber, paginationData.pageSize);

    const pagination = {
        pageNumber: paginationData.pageNumber,
        pageSize: paginationData.pageSize,
        totalItems: userList?.count,
        pages: Math.ceil(userList?.count / pageSize),
    };

    return {
        pagination,
        users: userList?.rows?.map((user: Model) => sanitizeOutput(user.get({ plain: true }))),
    };
};

export const getUsersByLastName = async ({
    lastName,
}: LastNameQueryParams): Promise<{ [key: string]: IUserData[] | IUserDataCounter[] }> => {
    const userList = await getUsersByUsernameOnDb(Users, 'last_name', lastName);
    const userLastNameCount = await getGroupCountUsersByUsernameOnDb(Users, 'last_name', lastName);

    const userListSanitized = userList.map((user: Model) => sanitizeOutput(user.get({ plain: true })));
    const userLastNameCountSanitized = userLastNameCount.map((user: Model) =>
        sanitizeOutputCounter(user.get({ plain: true })),
    );
    return { userLastNameCount: userLastNameCountSanitized, userList: userListSanitized };
};

export const deleteUserByUserId = async ({ userId = '' }: { userId?: string }) => {
    return db.transaction(async (trx) => {
        try {
            const deletedLogin = await deleteLoginByUserIdDb(userId, Login);
            const deleteUser = await deleteUserByUserIdOnDb(Users, userId);

            if (deleteUser !== 1 || deletedLogin !== 1) {
                await trx.rollback();
                return { msg: "Couldn't delete the user", status: 400 };
            }
            return { msg: 'Deleted' };
        } catch (error) {
            await trx.rollback();
            return error;
        }
    });
};
