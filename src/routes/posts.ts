import express, { Request, Response } from 'express';
import { createPost, getPosts } from '../controllers/post.controller';
import { IPost } from '../controllers/post.controller';

const router = express.Router();

router.post('/', (req: Request, res: Response) => {
    createPost(req.body)
        .then((createdPost: IPost) => res.json(createdPost))
        .catch((err) => {
            res.status(400);
            res.json(err);
        });
});

router.get('/:userId?', (req: Request, res: Response) => {
    const params = { ...req.params, ...req.query };
    getPosts(params)
        .then((createdPost: IPost) => res.json(createdPost))
        .catch((err) => {
            res.status(400);
            res.json(err);
        });
});

export default router;
