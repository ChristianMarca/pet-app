import { IUserData, IUserDataCounter } from '../controllers/user.controller';
import { IUserDB, IUserCountDB } from '../db/models/users.model';
import { IPostDB } from '../controllers/crud.models/post';
import { IPost } from '../controllers/post.controller';

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

export const sanitizePostOutput = (postInput: IPostDB): IPost => {
    const { _id: postId, user_id: userId, post, title } = postInput;
    return { userId, postId, content: { title, body: post.body } };
};
