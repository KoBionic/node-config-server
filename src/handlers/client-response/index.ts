import { Request, Response, NextFunction } from "express";


export default (req: Request, res: Response, next: NextFunction): Response => {
    const message = {
        status: res.statusCode,
        message: res["message"],
        data: res["body"]
    };

    return res
        .status(message.status)
        .send(message);
};
