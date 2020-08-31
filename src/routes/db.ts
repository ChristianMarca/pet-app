import express, { Request, Response } from 'express';
import { dbHealthCheck } from '../controllers/db.health.controller';
import Responses from '../controllers/interfaces/responses';
import { requireAuth } from '../middlewares/authentification/authentication';

const router = express.Router();

router.get('/db', requireAuth, async (req: Request, res: Response) => {
    const dbPing: Responses = await dbHealthCheck();
    res.json(dbPing);
});

export default router;
