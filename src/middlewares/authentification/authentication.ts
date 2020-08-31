import { Request, Response, NextFunction } from 'express';
import redisClient from '../../db/hashDb/redis';

export const requireAuth = (req: Request, res: Response, next: NextFunction): Response | boolean => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json('Unauthorized');
    }
    return redisClient.get(authorization, (err, reply) => {
        if (err || !reply) {
            return res.status(401).json('Unauthorized');
        }
        return next();
    });
};
