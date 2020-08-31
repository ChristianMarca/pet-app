import express, { Request, Response } from 'express';
import { revokeToken } from '../controllers/login.controller';

const router = express.Router();

router.put('/', (req: Request, res: Response) => {
    const { authorization } = req.headers;
    revokeToken({ authorization })
        .then((logoutUser: { [key: string]: string }) => res.json(logoutUser))
        .catch((err) => {
            res.status(400);
            res.json(err);
        });
});

export default router;
