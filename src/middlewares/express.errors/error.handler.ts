import { Request, Response } from 'express';
import HttpException from './HttpException';

const ErrorHandlerMiddleware = (err: HttpException, req: Request, res: Response): void => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.json({ error: 'Server Error' });
};

export default ErrorHandlerMiddleware;
