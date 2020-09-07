import { Model, ModelCtor, OrderItem, Sequelize, ModelAttributes } from 'sequelize';
import IUser from '../interfaces/user';
import { IUserData, IUserLogin } from '../user.controller';

export const createUserOnDB = async (user: IUser, usersModel: ModelCtor<Model>): Promise<Model> => {
    const { username, name, lastName } = user;

    return await usersModel.create({
        username,
        name,
        last_name: lastName,
    });
};

export const updateUserOnDB = async (
    user: { [key: string]: any },
    userId: string,
    usersModel: ModelCtor<Model>,
): Promise<[number, Model<ModelAttributes>[]]> => {
    return await usersModel.update(
        { ...user, updated_at: new Date() },
        { where: { user_id: userId }, returning: true },
    );
};

export const createNewLoginUser = async (loginData: IUserLogin, loginModel: ModelCtor<Model>): Promise<Model> => {
    const { email, password, userId } = loginData;

    return await loginModel.create({
        user_id: userId,
        email,
        password,
    });
};

export const getUserByCustomParameters = async (
    usersModel: ModelCtor<Model>,
    filterArgs: { [key: string]: string | number | boolean },
) => {
    return await usersModel.findOne({ where: filterArgs });
};

export const getOneUserByUsernameOnDb = async (
    usersModel: ModelCtor<Model>,
    field: string,
    value: string,
): Promise<Model> => {
    return await usersModel.findOne({ where: { [field]: value } });
};

export const getUsersOnDb = async (
    usersModel: ModelCtor<Model>,
    pageNumber: number,
    pageSize: number,
): Promise<{ rows: Model<ModelAttributes>[]; count: number }> => {
    const offset = pageNumber ? pageNumber - 1 : 1;
    return await usersModel.findAndCountAll({ offset, limit: pageSize, order: ['user_id', 'ASC'] });
};

export const getUsersSortedByFieldOnDb = async (
    usersModel: ModelCtor<Model>,
    sort: OrderItem[],
    pageNumber: number,
    pageSize: number,
): Promise<{ rows: Model<ModelAttributes>[]; count: number }> => {
    const pageNumberFixed = pageNumber ? pageNumber - 1 : 1;
    return await usersModel.findAndCountAll({ order: sort, offset: pageNumberFixed * pageSize, limit: pageSize });
};

export const getUsersByUsernameOnDb = async (
    usersModel: ModelCtor<Model>,
    field: string,
    value: string | string[],
): Promise<Model[]> => {
    return await usersModel.findAll({ where: { [field]: value } });
};

export const getGroupCountUsersByUsernameOnDb = async (
    usersModel: ModelCtor<Model>,
    field: string,
    value: string | string[],
): Promise<Model[]> => {
    return await usersModel.findAll({
        attributes: [field, [Sequelize.fn('COUNT', Sequelize.col(field)), 'n_times']],
        where: { [field]: value },
        group: [field],
    });
};

export const deleteUserByUserIdOnDb = async (usersModel: ModelCtor<Model>, userId: string) => {
    return await usersModel.destroy({ where: { user_id: userId } });
};
