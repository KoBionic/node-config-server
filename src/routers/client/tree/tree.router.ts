import { logger } from '@kobionic/server-lib';
import { NextFunction, Request, Response, Router } from 'express';
import { ContentService } from '../../../services';


const router: Router = Router();
const contentService: ContentService = ContentService.Instance;

/**
 * Returns a Tree view of the configuration files & folders loaded.
 *
 * @param {Request} req the Express request
 * @param {Response} res the Express response
 * @param {NextFunction} next the Express next function
 */
async function getTree(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const contentTree = await contentService.getTree();
        res
            .status(200)
            .json(contentTree);

    } catch (err) {
        logger.error('An error occured:', err.message);
        res.status(500);
        next(err);
    }
}

router
    .get('/tree', getTree);

export {
    router,
};

