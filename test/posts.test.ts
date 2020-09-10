import 'mocha';
import { expect } from 'chai';
import { createUser } from '../src/controllers/user.controller';
import { createPost, getPosts, updatePost, deletePostById } from '../src/controllers/post.controller';
import { db, truncateAll } from '../src/db';

describe('Post CRUD', () => {
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

    it('should create a new  user and a new post', async () => {
        const userData = {
            username: 'new username',
            name: 'new fake name',
            lastName: 'Fake Last Name',
            email: 'test@hotmail.com',
            password: '1234',
        };

        const post = {
            content: {
                title: 'My first post',
                body: 'My post content',
            },
        };

        const createdUser = await createUser(userData);
        const postCreated = await createPost({ userId: createdUser.userId, ...post });
        expect(postCreated).to.have.property('userId', createdUser.userId);
        expect(postCreated).to.have.property('postId');
        expect(postCreated).to.have.property('content');
        expect(postCreated.content).to.have.property('title', post.content.title);
        expect(postCreated.content).to.have.property('body', post.content.body);
    });

    it('should get all post', async () => {
        const userData = {
            username: 'new username',
            name: 'new fake name',
            lastName: 'Fake Last Name',
            email: 'test@hotmail.com',
            password: '1234',
        };
        const post = {
            content: {
                title: 'My first post',
                body: 'My post content',
            },
        };

        const createdUser = await createUser(userData);
        const postCreated = await createPost({ userId: createdUser.userId, ...post });
        const postsPagination = await getPosts({});

        expect(postsPagination).to.be.an('object').that.is.not.empty;
        expect(postsPagination).to.have.property('pagination');
        expect(postsPagination).to.have.property('posts');
        const { pagination, posts } = postsPagination;
        expect(posts[0]).to.have.property('postId');
        expect(posts[0]).to.have.property('userId');
        expect(posts[0].content).to.have.property('title');
        expect(posts[0].content).to.have.property('body');
        expect(pagination).to.have.property('pageNumber');
        expect(pagination).to.have.property('pageSize');
        expect(pagination).to.have.property('totalItems');
        expect(pagination).to.have.property('pages');
    });

    it('should get all post by userId', async () => {
        const userData = {
            username: 'new username',
            name: 'new fake name',
            lastName: 'Fake Last Name',
            email: 'test@hotmail.com',
            password: '1234',
        };
        const post = {
            content: {
                title: 'My first post',
                body: 'My post content',
            },
        };

        const createdUser = await createUser(userData);
        const postCreated = await createPost({ userId: createdUser.userId, ...post });
        const postsPagination = await getPosts({ userId: createdUser.userId });

        expect(postsPagination).to.be.an('object').that.is.not.empty;
        expect(postsPagination).to.have.property('pagination');
        expect(postsPagination).to.have.property('posts');
        const { pagination, posts } = postsPagination;
        expect(posts[0]).to.have.property('postId');
        expect(posts[0]).to.have.property('userId');
        expect(posts[0].content).to.have.property('title');
        expect(posts[0].content).to.have.property('body');
        expect(pagination).to.have.property('pageNumber');
        expect(pagination).to.have.property('pageSize');
        expect(pagination).to.have.property('totalItems');
        expect(pagination).to.have.property('pages');
    });

    it('should update a post by postId', async () => {
        const userData = {
            username: 'new username',
            name: 'new fake name',
            lastName: 'Fake Last Name',
            email: 'test@hotmail.com',
            password: '1234',
        };
        const post = {
            content: {
                title: 'My first post',
                body: 'My post content',
            },
        };

        const createdUser = await createUser(userData);
        const postCreated = await createPost({ userId: createdUser.userId, ...post });
        const updates = {
            content: {
                title: 'New title',
            },
        };
        const postUpdated = await updatePost({ postId: postCreated.postId, ...updates });

        expect(postUpdated).to.have.property('userId', createdUser.userId);
        expect(postUpdated).to.have.property('postId');
        expect(postUpdated).to.have.property('content');
        expect(postUpdated.content).to.have.property('title', updates.content.title);
        expect(postUpdated.content).to.have.property('body', post.content.body);
    });

    it('should delete post by postId', async () => {
        const userData = {
            username: 'new username',
            name: 'new fake name',
            lastName: 'Fake Last Name',
            email: 'test@hotmail.com',
            password: '1234',
        };
        const post = {
            content: {
                title: 'My first post',
                body: 'My post content',
            },
        };

        const createdUser = await createUser(userData);
        const postCreated = await createPost({ userId: createdUser.userId, ...post });

        const deletedUser = await deletePostById({ postId: postCreated.postId });

        expect(deletedUser).to.have.property('msg', 'Deleted');
    });
});
