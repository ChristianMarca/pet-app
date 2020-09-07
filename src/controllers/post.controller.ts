import { Posts } from '../db/models/micro_posts.model';
import { createPostOnDb, getPostsOnDb } from './crud.models/post';
import { sanitizePostOutput } from '../utils/utils';
import { db } from '../db';

export interface IPost {
    userId: string | number;
    content: {
        title: string;
        body: string | number;
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
    const posts = await getPostsOnDb(Posts, userId, pageNumber, pageSize);
    console.log('->>', posts);
    return posts;
};
