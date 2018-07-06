import { NextFunction, Request, Response, Router } from 'express';
import { ContentService } from '../../../services';
import { ErrorUtil } from '../../../utils';


const TREE_ROUTER_URL = '/tree';
const router: Router = Router();
const contentService = ContentService.Instance;

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
        ErrorUtil.handle(err, res, next);
    }
}

router
    .get(TREE_ROUTER_URL, getTree);

export {
    TREE_ROUTER_URL,
    router,
};
