import 'mocha';
import { expect } from 'chai';
import { sanitizeOutput, sanitizeOutputCounter } from '../src/utils/utils';

describe('Utilities', () => {
    it('should sanitize user object', async () => {
        const userData = {
            name: 'name',
            last_name: 'last name',
            username: 'username',
            created_at: 'date',
            updated_at: 'date',
        };
        const user = sanitizeOutput(userData);
        expect(user).to.have.property('username');
        expect(user).to.have.property('name');
        expect(user).to.have.property('lastName');
        expect(user).to.have.property('createdAt');
        expect(user).to.have.property('updatedAt');
    });

    it('should sanitize user count object', async () => {
        const userCountData = {
            n_times: '3',
            last_name: 'last name',
        };
        const user = sanitizeOutputCounter(userCountData);
        expect(user).to.have.property('nTimes');
        expect(user).to.have.property('lastName');
    });
});
