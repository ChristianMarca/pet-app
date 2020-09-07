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

router.get('/usernames/:username', requireAuth, (req: Request, res: Response) => {
    return getUserByUsername(req.params.username)
        .then((createdUser: IUserData) => res.json(createdUser))
        .catch((err) => {
            res.status(400);
            res.json(err);
        });
});

router.get('/', requireAuth, (req: Request, res: Response) => {
    const queryParameters: IUserGetAll = req.query;
    return getUsers(queryParameters)
        .then((createdUser) => res.json(createdUser))
        .catch((err) => {
            res.status(400);
            res.json(err);
        });
});

router.get('/lastNames/', requireAuth, (req: Request, res: Response) => {
    const queryParameters: LastNameQueryParams = req.query;
    return getUsersByLastName(queryParameters)
        .then((createdUser) => res.json(createdUser))
        .catch((err) => {
            res.status(400);
            res.json(err);
        });
});

router.post('/', (req: Request, res: Response) => {
    createUser(req.body)
        .then((createdUser: IUserLogin) => res.json(createdUser))
        .catch((err) => {
            res.status(400);
            res.json(err);
        });
});

router.put('/:userId', requireAuth, (req: Request, res: Response) => {
    updateUser(req.body, req.params.userId)
        .then((updatedUser: IUserResponse) => {
            if (updatedUser.status) {
                res.status(400).json(updatedUser);
            } else {
                res.json(updatedUser);
            }
        })
        .catch((err) => {
            res.status(400);
            res.json(err);
        });
});

router.delete('/:userId', requireAuth, (req: Request, res: Response) => {
    const queryParameters: { userId?: string } = req.params;

    deleteUserByUserId(queryParameters)
        .then((updatedUser: IUserResponse) => {
            if (updatedUser.status) {
                res.status(400).json(updatedUser);
            } else {
                res.json(updatedUser);
            }
        })
        .catch((err) => {
            res.status(400);
            res.json(err);
        });
});

export default router;
