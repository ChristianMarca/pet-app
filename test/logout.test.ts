import 'mocha';
import { expect, assert } from 'chai';
import { createUser } from '../src/controllers/user.controller';
import { signAuthentication, revokeToken } from '../src/controllers/login.controller';
import { db, truncateAll } from '../src/db';
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
        closeHash();
        done();
    });

    it('should logout using token', async () => {
        const userData = {
            username: 'new username',
            name: 'new fake name',
            lastName: 'Fake Last Name',
            email: 'test@hotmail.com',
            password: '1234',
        };

        const createdUser = await createUser(userData);
        const loggedUser = await signAuthentication({ email: userData.email, password: userData.password });
        const logout = await revokeToken({ authorization: loggedUser.token as string });
        expect(logout).to.have.property('msg', 'Deleted');
    });

});
