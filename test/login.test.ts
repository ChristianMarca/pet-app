import 'mocha';
import { expect, assert } from 'chai';
import { createUser } from '../src/controllers/user.controller';
import { signAuthentication } from '../src/controllers/login.controller';
import { db, truncateAll, truncateModel } from '../src/db';
import { truncateAll as truncateAllHash, close as closeHash } from '../src/db/hashDb/redis';

describe('Login CRUD', () => {
    let truncateDb: () => any;

    beforeEach(async () => {
        truncateAllHash();
        truncateDb = truncateAll(db, { restartIdentity: true, cascade: true });
    });

    afterEach(async () => {
        await truncateDb();
    });

    after((done) => {
        // db.close();
        // closeHash();
        done();
    });

    it('should login the new user created', async () => {
        const userData = {
            username: 'new username',
            name: 'new fake name',
            lastName: 'Fake Last Name',
            email: 'test@hotmail.com',
            password: '1234',
        };

        const createdUser = await createUser(userData);
        const loggedUser = await signAuthentication({ email: userData.email, password: userData.password });
        expect(loggedUser).to.have.property('username', userData.username);
        expect(loggedUser).to.have.property('name', userData.name);
        expect(loggedUser).to.have.property('lastName', userData.lastName);
        expect(loggedUser).to.have.property('createdAt');
        expect(loggedUser).to.have.property('updatedAt');
    });

    it('should login using the token ', async () => {
        const userData = {
            username: 'new username',
            name: 'new fake name',
            lastName: 'Fake Last Name',
            email: 'test@hotmail.com',
            password: '1234',
        };

        const createdUser = await createUser(userData);
        const loggedUserWithPassword = await signAuthentication({ email: userData.email, password: userData.password });
        const loggedUser = await signAuthentication({ authorization: loggedUserWithPassword.token as string });
        expect(loggedUser).to.have.property('username', userData.username);
        expect(loggedUser).to.have.property('name', userData.name);
        expect(loggedUser).to.have.property('lastName', userData.lastName);
        expect(loggedUser).to.have.property('createdAt');
        expect(loggedUser).to.have.property('updatedAt');
    });
});
