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
    const offsetFixed = pageNumber ? pageNumber - 1 : 1;

    const baseQuery = { offset: offsetFixed * pageSize, limit: pageSize, order: [['_id', 'ASC']] };
    const query: { [key: string]: any } =
        userId || typeof userId === 'string' ? { where: { user_id: userId }, ...baseQuery } : baseQuery;

    return await postsModel.findAndCountAll(query);
};

export const updatePostOnDB = async (
    post: { [key: string]: any },
    postId: string | number,
    postModel: ModelCtor<Model>,
): Promise<[number, Model<ModelAttributes>[]]> => {
    let updateData: any = post.title ? { title: post.title } : {};
    updateData = post.body ? { ...updateData, post: { body: post.body } } : updateData;

    return await postModel.update(
        { ...updateData, updated_at: new Date() },
        { where: { _id: postId }, returning: true },
    );
};

export const deletePostByIdOnDb = async (postsModel: ModelCtor<Model>, postId: string) => {
    return await postsModel.destroy({ where: { _id: postId } });
};
