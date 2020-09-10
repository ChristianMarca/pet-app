import express, { Request, Response } from 'express';
import { createPost, getPosts, updatePost, deletePostById } from '../controllers/post.controller';
import { IPost } from '../controllers/post.controller';
import { requireAuth } from '../middlewares/authentification/authentication';

const router = express.Router();

router.post('/', requireAuth, (req: Request, res: Response) => {
    createPost(req.body)
        .then((createdPost: IPost) => res.json(createdPost))
        .catch((err) => {
            res.status(400);
            res.json(err);
        });
});

router.get('/users/:userId?', requireAuth, (req: Request, res: Response) => {
    const params = { ...req.params, ...req.query };
    getPosts(params)
        .then((createdPost: IPost) => res.json(createdPost))
        .catch((err) => {
            res.status(400);
            res.json(err);
        });
});

router.patch('/:postId', requireAuth, (req: Request, res: Response) => {
    const params = { ...req.params, ...req.body };
    updatePost(params)
        .then((createdPost: IPost) => res.json(createdPost))
        .catch((err) => {
            res.status(400);
            res.json(err);
        });
});

router.delete('/:postId', requireAuth, (req: Request, res: Response) => {
    const params = { ...req.params };
    deletePostById(params)
        .then((createdPost: IPost) => res.json(createdPost))
        .catch((err) => {
            res.status(400);
            res.json(err);
        });
});

export default router;
