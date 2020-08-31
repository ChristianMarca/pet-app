import bcrypt from 'bcrypt';

export const encryptPassword = (password: string): Promise<string> => {
    return bcrypt.hash(password, 1);
};

export const verifyPassword = (password: string, passwordHash: string): Promise<boolean> => {
    return bcrypt.compare(password, passwordHash);
};
