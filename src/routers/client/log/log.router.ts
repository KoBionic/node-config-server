import { NextFunction, Request, Response, Router } from 'express';
import { ContentService } from '../../../services';
import { ErrorUtil } from '../../../utils';


const LOG_ROUTER_URL = '/log';
const router: Router = Router();
const contentService = ContentService.Instance;

/**
 * Returns logs read from current JSON logging file.
 *
 * @param {Request} req the Express request
 * @param {Response} res the Express response
 * @param {NextFunction} next the Express next function
 */
async function getLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const logs = await contentService.getLogs();
        res
            .status(200)
            .json(logs);
    } catch (err) {
        ErrorUtil.handle(err, res, next);
    }
}

router
    .get(LOG_ROUTER_URL, getLogs);

export {
    LOG_ROUTER_URL,
    router,
};
