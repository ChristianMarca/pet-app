import express, { Request, Response } from 'express';
import {
    createUser,
    getUserByUsername,
    getUsers,
    getUsersByLastName,
    updateUser,
    deleteUserByUserId,
} from '../controllers/user.controller';
import { IUserGetAll, LastNameQueryParams } from '../controllers/user.controller';
import { IUserData, IUserLogin, IUserResponse } from '../controllers/user.controller';
import { requireAuth } from '../middlewares/authentification/authentication';

const router = express.Router();

router.post('/users', (req: Request, res: Response) => {
    createUser(req.body)
        .then((createdUser: IUserLogin) => res.json(createdUser))
        .catch((err) => {
            res.status(400);
            res.json(err);
        });
});

export default router;
