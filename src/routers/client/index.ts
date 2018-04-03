import * as express from "express";

import { GenericRouter } from "..";
import { ContentService, logger } from "../../services";


/**
 * Client applications router.
 *
 * @class ClientRouter
 * @extends {GenericRouter}
 */
class ClientRouter extends GenericRouter {

    /** The UI Express router. */
    public router: express.Router;

    /** The Content service. */
    private contentService: ContentService;


    /**
     * Default constructor.
     *
     * @memberof ClientRouter
     */
    constructor() {
        super();
        this.router = express.Router();
        this.contentService = new ContentService();
        this.registerRoutes();
    }


    /**
     * Initializes routes by adding them to the router.
     *
     * @memberof ClientRouter
     */
    public registerRoutes(): void {
        this.router.get("/tree", this.tree.bind(this));
    }

    /**
     * Returns a Tree view of the configuration files & folders loaded.
     *
     * @private
     * @param {express.Request} req the Express request
     * @param {express.Response} res the Express response
     * @param {express.NextFunction} next the Express next function
     * @memberof ClientRouter
     */
    private async tree(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        try {
            const tree = await this.contentService.getTree();
            res.status(200);
            res["body"] = tree;
            next();

        } catch (err) {
            logger.error("An error occured:", err.message);
            res.status(500);
            next(err);
        }
    }

}

// Export router for injection in Express application
const Router = new ClientRouter().router;
export { Router };
