// eslint-disable-next-line @typescript-eslint/no-var-requires
// tslint:disable-next-line:no-var-requires
const SequelizeMock = require('sequelize-mock');
import { ImportMock } from 'ts-mock-imports';
import 'mocha';
import { expect } from 'chai';
import { createUser, getUserByUsername, getUsers, getUsersByLastName } from '../src/controllers/user.controller';
import * as usersModel from '../src/db/models/users.model';

describe.skip('User CRUD', () => {
    let dbMock: any = null;
    let UserMock: any = null;
    let userControllerMocked: any = null;

    beforeEach(() => {
        dbMock = new SequelizeMock();
        const userData = {
            username: 'username',
            name: 'Fake name',
            last_name: 'Fake Last Name',
            created_at: '2020-08-21T01:27:29.280Z',
            updated_at: '2020-08-21T01:27:29.280Z',
        };

        UserMock = dbMock.define('users', userData);
        userControllerMocked = ImportMock.mockOther(usersModel, 'Users', UserMock);
    });

    afterEach(() => {
        userControllerMocked.restore();
    });

    it.skip('should create a new user', async () => {
        // TODO
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
        const user = await getUserByUsername('username');
        expect(user).to.have.property('username', 'username');
        expect(user).to.have.property('name', 'Fake name');
        expect(user).to.have.property('lastName', 'Fake Last Name');
        expect(user).to.have.property('createdAt');
        expect(user).to.have.property('updatedAt');
    });

    it('should get fail user by username', async () => {
        userControllerMocked.restore();
        const createdUser = await getUserByUsername('username2');
        expect(createdUser).to.be.an('object');
        expect(createdUser).to.eql({});
    });

    // it('should get all users', async () => {
    //     const users = await getUsers({});
    //
    //     expect(users).to.be.an('array').that.is.not.empty;
    //     expect(users[0]).to.have.property('username');
    //     expect(users[0]).to.have.property('name');
    //     expect(users[0]).to.have.property('lastName');
    //     expect(users[0]).to.have.property('createdAt');
    //     expect(users[0]).to.have.property('updatedAt');
    // });

    // it('should get all users sorted by name (DESC)', async () => {
    //     // TODO FIND THE WAY TO INSERT MANY ROW TO TEST TE LOGIC
    //     const users = await getUsers({ name: 'DESC' });
    //
    //     expect(users).to.be.an('array').that.is.not.empty;
    //     expect(users[0]).to.have.property('username');
    //     expect(users[0]).to.have.property('name');
    //     expect(users[0]).to.have.property('lastName');
    //     expect(users[0]).to.have.property('createdAt');
    //     expect(users[0]).to.have.property('updatedAt');
    // });

    it('should get all users and the repetition count', async () => {
        const users = await getUsersByLastName({ lastName: ['Fake Last Name'] });

        expect(users).to.be.an('object');
        expect(users).to.be.have.property('userLastNameCount');
        expect(users).to.be.have.property('userList');
        expect(users.userList).to.an('array').that.is.not.empty;
        expect(users.userList[0]).to.have.property('username');
        expect(users.userList[0]).to.have.property('name');
        expect(users.userList[0]).to.have.property('lastName');
        expect(users.userList[0]).to.have.property('createdAt');
        expect(users.userList[0]).to.have.property('updatedAt');
        expect(users.userLastNameCount).to.an('array').that.is.not.empty;
        expect(users.userLastNameCount[0]).to.have.property('lastName');
        expect(users.userLastNameCount[0]).to.have.property('nTimes');
    });
});
