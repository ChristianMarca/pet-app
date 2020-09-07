import { IPost } from '../post.controller';
import { Model, ModelAttributes, ModelCtor } from 'sequelize';

export interface IPostDB {
    _id: number;
    user_id: number;
    post: { [key: string]: string | number };
    title: string;
}

export const createPostOnDb = async (postData: IPost, postModel: ModelCtor<Model>): Promise<Model> => {
    const {
        userId,
        content: { title, body },
    } = postData;

    return await postModel.create({
        user_id: userId,
        post: {
            body,
        },
        title,
    });
};

export const getPostsOnDb = async (
    postsModel: ModelCtor<Model>,
    userId: string | undefined,
    pageNumber: number,
    pageSize: number,
): Promise<{ rows: Model<ModelAttributes>[]; count: number }> => {
    const offset = pageNumber ? pageNumber - 1 : 1;
    const baseQuery = { offset, limit: pageSize, order: ['_id', 'ASC'] };
    const query = userId || typeof userId === 'string' ? { where: { user_id: userId }, ...baseQuery } : baseQuery;
    // if (userId && typeof userId === 'string') {
    //     query = { ...query, where: { user_id: userId } };
    // }
    console.log('->>', query, userId);
    return await postsModel.findAndCountAll(query);
};
