import 'mocha';
import { expect } from 'chai';
import {
    createUser,
    getUserByUsername,
    getUsers,
    getUsersByLastName,
    deleteUserByUserId,
} from '../src/controllers/user.controller';
import { db, truncateAll } from '../src/db';
import { Users } from '../src/db/models';

// TODO https://stackoverflow.com/questions/38588323/sequelize-transactional-tests
describe('User CRUD', () => {
    let truncateDb: () => any;

    beforeEach(async () => {
        // truncateDb = truncateModel(Users, { restartIdentity: true });
        truncateDb = truncateAll(db, { restartIdentity: true, cascade: true });
    });

    afterEach(async () => {
        await truncateDb();
    });

    after((done) => {
        db.close();
        done();
    });

    it('should create a new user', async () => {
        const userData = {
            username: 'new username',
            name: 'new fake name',
            lastName: 'Fake Last Name',
            email: 'test@hotmail.com',
            password: '1234',
        };

        const createdUser = await createUser(userData);
        expect(createdUser).to.have.property('username', userData.username);
        expect(createdUser).to.have.property('name', userData.name);
        expect(createdUser).to.have.property('lastName', userData.lastName);
        expect(createdUser).to.have.property('createdAt');
        expect(createdUser).to.have.property('updatedAt');
    });

    it('should get user by username', async () => {
        const userData = {
            username: 'new username',
            name: 'new fake name',
            lastName: 'Fake Last Name',
            email: 'test@hotmail.com',
            password: '1234',
        };

        await createUser(userData);
        const user = await getUserByUsername(userData.username);
        expect(user).to.have.property('username', userData.username);
        expect(user).to.have.property('name', userData.name);
        expect(user).to.have.property('lastName', userData.lastName);
        expect(user).to.have.property('createdAt');
        expect(user).to.have.property('updatedAt');
    });

    it('should get fail user by username', async () => {
        const createdUser = await getUserByUsername('username2');
        expect(createdUser).to.be.an('object');
        expect(createdUser).to.eql({});
    });

    it('should get all users', async () => {
        const userData = {
            username: 'new username',
            name: 'new fake name',
            lastName: 'Fake Last Name',
            email: 'test@hotmail.com',
            password: '1234',
        };

        await createUser(userData);
        const usersPagination = await getUsers({});

        expect(usersPagination).to.be.an('object').that.is.not.empty;
        expect(usersPagination).to.have.property('pagination');
        expect(usersPagination).to.have.property('users');
        const { pagination, users } = usersPagination;
        expect(users[0]).to.have.property('username');
        expect(users[0]).to.have.property('name');
        expect(users[0]).to.have.property('lastName');
        expect(users[0]).to.have.property('createdAt');
        expect(users[0]).to.have.property('updatedAt');
        expect(pagination).to.have.property('pageNumber');
        expect(pagination).to.have.property('pageSize');
        expect(pagination).to.have.property('totalItems');
        expect(pagination).to.have.property('pages');
    });

    it('should get all users sorted by name (ASC)', async () => {
        const userData = {
            username: 'new username',
            name: 'new fake name',
            lastName: 'Fake Last Name',
            email: 'test@hotmail.com',
            password: '1234',
        };
        const userData2 = {
            username: 'another',
            name: 'Abel',
            lastName: 'Fake Last Name',
            email: 'test1@hotmail.com',
            password: '1234',
        };

        await createUser(userData);
        await createUser(userData2);
        const usersPagination = await getUsers({ name: 'ASC' });

        // tslint:disable-next-line:no-unused-expression
        expect(usersPagination).to.be.an('object').that.is.not.empty;
        const { users } = usersPagination;
        expect(users[0]).to.have.property('username');
        expect(users[0]).to.have.property('name');
        expect(users[0]).to.have.property('lastName');
        expect(users[0]).to.have.property('createdAt');
        expect(users[0]).to.have.property('updatedAt');
        expect(users[0]).to.have.property('name', userData2.name);
        expect(users[1]).to.have.property('name', userData.name);
    });

    it('should get all users and the repetition count', async () => {
        const userData = {
            username: 'new username',
            name: 'new fake name',
            lastName: 'Fake Last Name',
            email: 'test@hotmail.com',
            password: '1234',
        };

        await createUser(userData);
        const users = await getUsersByLastName({ lastName: ['Fake Last Name'] });

        expect(users).to.be.an('object');
        expect(users).to.be.have.property('userLastNameCount');
        expect(users).to.be.have.property('userList');
        // tslint:disable-next-line:no-unused-expression
        expect(users.userList).to.an('array').that.is.not.empty;
        expect(users.userList[0]).to.have.property('username');
        expect(users.userList[0]).to.have.property('name');
        expect(users.userList[0]).to.have.property('lastName');
        expect(users.userList[0]).to.have.property('createdAt');
        expect(users.userList[0]).to.have.property('updatedAt');
        // tslint:disable-next-line:no-unused-expression
        expect(users.userLastNameCount).to.an('array').that.is.not.empty;
        expect(users.userLastNameCount[0]).to.have.property('lastName');
        expect(users.userLastNameCount[0]).to.have.property('nTimes');
    });

    it('should delete user by userId', async () => {
        const userData = {
            username: 'new username',
            name: 'new fake name',
            lastName: 'Fake Last Name',
            email: 'test@hotmail.com',
            password: '1234',
        };

        await createUser(userData);
        const user = await getUserByUsername(userData.username);
        const deletedUser = await deleteUserByUserId({ userId: user.userId });
        const userAfterDelete = await getUserByUsername(userData.username);
        expect(userAfterDelete).to.be.empty;
        expect(deletedUser).to.have.property('msg', 'Deleted');
    });
});
