import 'mocha';
import { expect } from 'chai';
import { createUser } from '../src/controllers/user.controller';
import {
    createLink,
    deleteLinkById,
    getFollowedUsers,
    getFollowMeUsers,
} from '../src/controllers/relationship.controller';
import { db, truncateAll } from '../src/db';

describe('User relationship CRUD', () => {
    let truncateDb: () => any;

    beforeEach(async () => {
        truncateDb = truncateAll(db, { restartIdentity: true, cascade: true });
    });

    afterEach(async () => {
        await truncateDb();
    });

    after((done) => {
        // db.close();
        done();
    });

    it('should create a new user relationship', async () => {
        const userData = {
            username: 'new username',
            name: 'new fake name',
            lastName: 'Fake Last Name',
            email: 'test@hotmail.com',
            password: '1234',
        };
        const secondUserData = {
            username: 'new username 1',
            name: 'new fake name 1',
            lastName: 'Fake Last Name 1',
            email: 'test1@hotmail.com',
            password: '1234',
        };

        const createdUser = await createUser(userData);
        const createdSecondUser = await createUser(secondUserData);
        const createRelationship = await createLink({
            userId: parseInt(createdUser.userId, 10),
            followedUserId: parseInt(createdSecondUser.userId, 10),
        });
        expect(createRelationship).to.have.property('linkId');
        expect(createRelationship).to.have.property('userId');
        expect(createRelationship).to.have.property('followedUserId');
    });

    it('should get all followed users', async () => {
        const userData = {
            username: 'new username',
            name: 'new fake name',
            lastName: 'Fake Last Name',
            email: 'test@hotmail.com',
            password: '1234',
        };

        const secondUserData = {
            username: 'new username 1',
            name: 'new fake name 1',
            lastName: 'Fake Last Name 1',
            email: 'test1@hotmail.com',
            password: '1234',
        };

        const createdUser = await createUser(userData);
        const createdSecondUser = await createUser(secondUserData);
        await createLink({
            userId: parseInt(createdUser.userId, 10),
            followedUserId: parseInt(createdSecondUser.userId, 10),
        });
        const getRelationships = await getFollowedUsers({ userId: parseInt(createdUser.userId, 10) });

        expect(getRelationships).to.be.an('object').that.is.not.empty;
        expect(getRelationships).to.have.property('pagination');
        expect(getRelationships).to.have.property('links');
        const { pagination, links } = getRelationships;
        expect(links[0]).to.have.property('linkId');
        expect(links[0]).to.have.property('userId');
        expect(links[0]).to.have.property('followedUserId');
        expect(links[0]).to.have.property('subscriber');
        expect(links[0].subscriber).to.have.property('username');
        expect(pagination).to.have.property('pageNumber');
        expect(pagination).to.have.property('pageSize');
        expect(pagination).to.have.property('totalItems');
        expect(pagination).to.have.property('pages');
    });

    it('should get all follow me users', async () => {
        const userData = {
            username: 'new username',
            name: 'new fake name',
            lastName: 'Fake Last Name',
            email: 'test@hotmail.com',
            password: '1234',
        };

        const secondUserData = {
            username: 'new username 1',
            name: 'new fake name 1',
            lastName: 'Fake Last Name 1',
            email: 'test1@hotmail.com',
            password: '1234',
        };

        const createdUser = await createUser(userData);
        const createdSecondUser = await createUser(secondUserData);
        await createLink({
            userId: parseInt(createdUser.userId, 10),
            followedUserId: parseInt(createdSecondUser.userId, 10),
        });
        const getRelationships = await getFollowMeUsers({ userId: parseInt(createdSecondUser.userId, 10) });

        expect(getRelationships).to.be.an('object').that.is.not.empty;
        expect(getRelationships).to.have.property('pagination');
        expect(getRelationships).to.have.property('links');
        const { pagination, links } = getRelationships;
        expect(links[0]).to.have.property('linkId');
        expect(links[0]).to.have.property('userId');
        expect(links[0]).to.have.property('followedUserId');
        expect(links[0]).to.have.property('creator');
        expect(links[0].creator).to.have.property('username');
        expect(pagination).to.have.property('pageNumber');
        expect(pagination).to.have.property('pageSize');
        expect(pagination).to.have.property('totalItems');
        expect(pagination).to.have.property('pages');
    });

    it('should delete post by postId', async () => {
        const userData = {
            username: 'new username',
            name: 'new fake name',
            lastName: 'Fake Last Name',
            email: 'test@hotmail.com',
            password: '1234',
        };

        const secondUserData = {
            username: 'new username 1',
            name: 'new fake name 1',
            lastName: 'Fake Last Name 1',
            email: 'test1@hotmail.com',
            password: '1234',
        };

        const createdUser = await createUser(userData);
        const createdSecondUser = await createUser(secondUserData);
        const createRelationship = await createLink({
            userId: parseInt(createdUser.userId, 10),
            followedUserId: parseInt(createdSecondUser.userId, 10),
        });

        const deletedUserRelationship = await deleteLinkById({ linkId: createRelationship.linkId });

        expect(deletedUserRelationship).to.have.property('msg', 'Deleted');
    });
});
