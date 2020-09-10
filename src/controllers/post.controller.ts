import { Posts } from '../db/models/micro_posts.model';
import { createPostOnDb, getPostsOnDb, updatePostOnDB, deletePostByIdOnDb } from './crud.models/post';
import { sanitizePostOutput } from '../utils/utils';
import { db } from '../db';
import { Model, ModelAttributes } from 'sequelize';

export interface IPost {
    userId: string | number;
    postId?: number;
    content: {
        title?: string;
        body?: string | number;
    };
    createdAt?: string;
    updatedAt?: string;
}

export type PaginationPostRequest = {
    userId?: string;
    pageNumber?: number;
    pageSize?: number;
};

export const createPost = async ({ userId, content }: IPost): Promise<any> => {
    return db.transaction(async (trx) => {
        try {
            const createdPost = await createPostOnDb({ userId, content }, Posts);
            return sanitizePostOutput(createdPost.get({ plain: true }));
        } catch (error) {
            return await trx.rollback();
        }
    });
};

export const getPosts = async ({ userId, pageNumber = 1, pageSize = 10 }: PaginationPostRequest): Promise<any> => {
    const paginationData = {
        pageNumber: typeof pageNumber === 'string' ? parseInt(pageNumber, 10) : pageNumber,
        pageSize: typeof pageSize === 'string' ? parseInt(pageSize, 10) : pageSize,
    };

    const posts: { [key: string]: any } = await getPostsOnDb(Posts, userId, pageNumber, pageSize);
    const pagination = {
        pageNumber: paginationData.pageNumber,
        pageSize: paginationData.pageSize,
        totalItems: posts?.count,
        pages: Math.ceil(posts?.count / pageSize),
    };

    return {
        pagination,
        posts: posts?.rows?.map((user: Model) => sanitizePostOutput(user.get({ plain: true }))),
    };
};

export const updatePost = async ({ postId, content = {} }: Partial<IPost>): Promise<any> => {
    return db.transaction(async (trx) => {
        try {
            const [changesNumber, postUpdated]: [number, Model<ModelAttributes>[]] = await updatePostOnDB(
                content,
                postId,
                Posts,
            );

            if (changesNumber && postUpdated.length) {
                const updates: any = postUpdated[0].get({ plain: true });
                return sanitizePostOutput(updates);
            } else {
                return { msg: 'cannot update post', status: 400 };
            }
        } catch (error) {
            return await trx.rollback();
        }
    });
};

export const deletePostById = async ({ postId = '' }: { postId?: string }) => {
    return db.transaction(async (trx) => {
        try {
            const deletedPost = await deletePostByIdOnDb(Posts, postId);

            if (deletedPost !== 1) {
                await trx.rollback();
                return { msg: "Couldn't delete post", status: 400 };
            }
            return { msg: 'Deleted' };
        } catch (error) {
            await trx.rollback();
            return error;
        }
    });
};
