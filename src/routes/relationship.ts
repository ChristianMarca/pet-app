import express, { Request, Response } from 'express';
import { createLink, deleteLinkById, getFollowedUsers, getFollowMeUsers } from '../controllers/relationship.controller';
import { PaginationRequest } from '../controllers/user.controller';
import { requireAuth } from '../middlewares/authentification/authentication';

const router = express.Router();

router.post('/users', (req: Request, res: Response) => {
    createLink(req.body)
        .then((createdUser: any) => res.json(createdUser))
        .catch((err) => {
            res.status(400);
            res.json(err);
        });
});

router.get('/followed/users/:userId', (req: Request, res: Response) => {
    const { userId } = req.params;
    const queryParameters: PaginationRequest = req.query;
    getFollowedUsers({ userId: parseInt(userId, 10), ...queryParameters })
        .then((createdUser: any) => res.json(createdUser))
        .catch((err) => {
            res.status(400);
            res.json(err);
        });
});

router.get('/follow/me/users/:userId', (req: Request, res: Response) => {
    const { userId } = req.params;
    const queryParameters: PaginationRequest = req.query;
    getFollowMeUsers({ userId: parseInt(userId, 10), ...queryParameters })
        .then((createdUser: any) => res.json(createdUser))
        .catch((err) => {
            res.status(400);
            res.json(err);
        });
});

router.delete('/:linkId', requireAuth, (req: Request, res: Response) => {
    const params = { ...req.params };
    deleteLinkById(params)
        .then((deletedLink) => res.json(deletedLink))
        .catch((err) => {
            res.status(400);
            res.json(err);
        });
});

export default router;
