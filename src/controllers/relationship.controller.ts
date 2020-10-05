import { db } from '../db';
import { RelationShip } from '../db/models/user.relationship.model';
import { Users } from '../db/models';
import {
    IRelationship,
    createLinkOnDb,
    deleteLinkByIdOnDb,
    getFollowedByUserIdOnDb,
    getFollowMeByUserIdOnDb,
    getFollowedByUserIdWPOnDb,
} from './crud.models/relationships';
import { IUserData, PaginationRequest } from './user.controller';
import { Model } from 'sequelize';
import { sanitizeLinkOutput } from '../utils/utils';

export interface PaginationResponse {
    pagination: { [key: string]: number };
    links: IRelationship[];
}

export type ILinkGetAll = { userId: number } & PaginationRequest;

export const createLink = async ({ userId, followedUserId }: IRelationship): Promise<any> => {
    return db.transaction(async (trx) => {
        try {
            const createdPost = await createLinkOnDb({ userId, followedUserId }, RelationShip);

            return sanitizeLinkOutput(createdPost.get({ plain: true }));
        } catch (error) {
            return await trx.rollback();
        }
    });
};

export const getFollowedUsers = async ({
    userId,
    pageNumber = 1,
    pageSize = 10,
}: ILinkGetAll): Promise<PaginationResponse | IRelationship[]> => {
    if (pageSize === 0 || parseInt(pageSize.toString(), 10) === 0) {
        const followersFlatList = await getFollowedByUserIdWPOnDb(userId, RelationShip, Users);
        return followersFlatList?.map((user: Model) => sanitizeLinkOutput(user.get({ plain: true })));
    }

    const paginationData = {
        pageNumber: typeof pageNumber === 'string' ? parseInt(pageNumber, 10) : pageNumber,
        pageSize: typeof pageSize === 'string' ? parseInt(pageSize, 10) : pageSize,
    };

    const followersList: { [key: string]: any } = await getFollowedByUserIdOnDb(
        userId,
        RelationShip,
        Users,
        pageNumber,
        pageSize,
    );

    const pagination = {
        pageNumber: paginationData.pageNumber,
        pageSize: paginationData.pageSize,
        totalItems: followersList?.count,
        pages: Math.ceil(followersList?.count / pageSize),
    };

    return {
        pagination,
        links: followersList?.rows?.map((user: Model) => sanitizeLinkOutput(user.get({ plain: true }))),
    };
};

export const getFollowMeUsers = async ({
    userId,
    pageNumber = 1,
    pageSize = 10,
}: ILinkGetAll): Promise<PaginationResponse> => {
    const paginationData = {
        pageNumber: typeof pageNumber === 'string' ? parseInt(pageNumber, 10) : pageNumber,
        pageSize: typeof pageSize === 'string' ? parseInt(pageSize, 10) : pageSize,
    };
    const followersList: { [key: string]: any } = await getFollowMeByUserIdOnDb(
        userId,
        RelationShip,
        Users,
        pageNumber,
        pageSize,
    );

    const pagination = {
        pageNumber: paginationData.pageNumber,
        pageSize: paginationData.pageSize,
        totalItems: followersList?.count,
        pages: Math.ceil(followersList?.count / pageSize),
    };

    return {
        pagination,
        links: followersList?.rows?.map((user: Model) => sanitizeLinkOutput(user.get({ plain: true }))),
    };
};

export const deleteLinkById = async ({
    linkId = '',
}: {
    linkId?: string;
}): Promise<{ [key: string]: string | number }> => {
    return db.transaction(async (trx) => {
        try {
            const deletedPost = await deleteLinkByIdOnDb(RelationShip, linkId);

            if (deletedPost !== 1) {
                await trx.rollback();
                return { msg: "Couldn't delete link", status: 400 };
            }
            return { msg: 'Deleted' };
        } catch (error) {
            await trx.rollback();
            return error;
        }
    });
};
