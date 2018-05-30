import { NextFunction, Request, Response } from 'express';


export default (err: Error, req: Request, res: Response, next: NextFunction): Response => {
    const message = {
        status: res.statusCode,
        message: err.message,
        stacktrace: process.env.NODE_ENV === 'development' ? err.stack.replace(/\n\s+/g, ' ') : undefined,
    };

    return res
        .status(message.status)
        .send(message);
};
