import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import indexRouter from './routes/db';
import userRouter from './routes/users';
import loginRouter from './routes/login';
import logoutRouter from './routes/logout';
import postRouter from './routes/posts';
import loggerMiddleware from './middlewares/logger/logger';
import ErrorHandlerMiddleware from './middlewares/express.errors/error.handler';

const port = 3001;

const app: express.Application = express();

app.use(cors());
app.use(bodyParser.json());
app.use(loggerMiddleware);
app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/posts', postRouter);

app.use((req: Request, res: Response) => {
    res.status(404).json({ msg: "Url didn't find" });
});
app.use(ErrorHandlerMiddleware);

app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`);
});
