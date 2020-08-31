import { IUserData, IUserDataCounter } from '../controllers/user.controller';
import { IUserDB, IUserCountDB } from '../db/models/users.model';

export const sanitizeOutput = (outputObj: IUserDB, includeId = false): IUserData => {
    const {
        username,
        name,
        last_name: lastName,
        created_at: createdAt,
        updated_at: updatedAt,
        user_id: userId,
    } = outputObj;
    const baseObj = { username, name, lastName, createdAt, updatedAt };
    return includeId ? { ...baseObj, userId } : baseObj;
};

export const sanitizeOutputCounter = (outputObj: IUserCountDB): IUserDataCounter => {
    const { last_name: lastName, n_times: nTimes } = outputObj;
    return { lastName, nTimes };
};

export const filterValuesOnObject = (obj: { [key: string]: any }, validTypes: string[]) => {
    return Object.entries(obj).reduce((acc, curr) => {
        const [key, value] = curr;
        return validTypes.includes(typeof value) ? { ...acc, [key]: value } : acc;
    }, {});
};
