import { NextFunction, Request, Response } from "express";


export default (req: Request, res: Response, next: NextFunction): Response => {
    const message = {
        status: res.statusCode,
        message: res.locals.message,
        data: res.locals.body
    };

    return res
        .status(message.status)
        .send(message);
};
