import express, { Request, Response } from 'express';
import { signAuthentication } from '../controllers/login.controller';

const router = express.Router();

router.post('/', (req: Request, res: Response) => {
    const authenticationElements = { ...req.headers, ...req.body };
    signAuthentication(authenticationElements)
        .then((loggedUser: { [key: string]: string }) => res.json(loggedUser))
        .catch((err) => {
            res.status(400);
            res.json(err);
        });
});

export default router;
