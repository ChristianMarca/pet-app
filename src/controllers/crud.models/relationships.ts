import { Model, ModelCtor, ModelAttributes } from 'sequelize';
import { IUserData } from '../user.controller';

export interface IRelationship {
    _id?: number;
    userId: number;
    followedUserId: number;
    subscriber?: IUserData;
    creator?: IUserData;
    createdAt?: string;
    updatedAt?: string;
}

export const createLinkOnDb = async (postData: IRelationship, relationshipModel: ModelCtor<Model>): Promise<Model> => {
    const { userId, followedUserId } = postData;

    return await relationshipModel.create({
        user_id: userId,
        followed_user_id: followedUserId,
    });
};

export const getFollowedByUserIdOnDb = async (
    userId: number,
    relationshipModel: ModelCtor<Model>,
    userModel: ModelCtor<Model>,
    pageNumber: number,
    pageSize: number,
): Promise<{ rows: Model<ModelAttributes>[]; count: number }> => {
    const offset = pageNumber ? pageNumber - 1 : 1;
    return relationshipModel.findAndCountAll({
        offset: offset * pageSize,
        limit: pageSize,
        order: [['_id', 'ASC']],
        where: { user_id: userId },
        include: [
            {
                model: userModel,
                as: 'subscriber',
            },
        ],
    });
};

export const getFollowedByUserIdWPOnDb = async (
    userId: number,
    relationshipModel: ModelCtor<Model>,
    userModel: ModelCtor<Model>,
): Promise<Model<ModelAttributes>[]> => {
    return relationshipModel.findAll({
        where: { user_id: userId },
        include: [
            {
                model: userModel,
                as: 'subscriber',
            },
        ],
    });
};

export const getFollowMeByUserIdOnDb = async (
    userId: number,
    relationshipModel: ModelCtor<Model>,
    userModel: ModelCtor<Model>,
    pageNumber: number,
    pageSize: number,
): Promise<{ rows: Model<ModelAttributes>[]; count: number }> => {
    const offset = pageNumber ? pageNumber - 1 : 1;
    return relationshipModel.findAndCountAll({
        offset: offset * pageSize,
        limit: pageSize,
        order: [['_id', 'ASC']],
        where: { followed_user_id: userId },
        include: [
            {
                model: userModel,
                as: 'creator',
            },
        ],
    });
};

export const deleteLinkByIdOnDb = async (relationship: ModelCtor<Model>, linkId: string) => {
    return await relationship.destroy({ where: { _id: linkId } });
};
