import * as express from "express";

import { GenericRouter } from "..";
import { AppUtil, FsUtil } from "../../utils";


/**
 * Metrics router.
 *
 * @class MetricsRouter
 * @extends {GenericRouter}
 */
class MetricsRouter extends GenericRouter {

    /** The Configuration Reader Express router. */
    public router: express.Router;


    /**
     * Default constructor.
     *
     * @memberof MetricsRouter
     */
    constructor() {
        super();
        this.router = express.Router();
        this.registerRoutes();
    }


    /**
     * Initializes routes by adding them to the router.
     *
     * @memberof MetricsRouter
     */
    public registerRoutes(): void {
        this.router.get("/extensions", this.getExtensions.bind(this));
    }

    /**
     * Gives metrics about file extensions that are in configuration directory.
     *
     * @private
     * @param {express.Request} req the Express request
     * @param {express.Response} res the Express response
     * @param {express.NextFunction} next the Express next function
     * @returns {Promise<void>}
     * @memberof MetricsRouter
     */
    private async getExtensions(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        const extensions = {};
        const files = await FsUtil.ls(AppUtil.CONFIG_DIR);

        files.forEach(file => {
            const ext = file.match(/(?<=\.)\w+$/);
            ext
                ? extensions[ext[0]] = extensions[ext[0]] ? extensions[ext[0]] + 1 : 1
                : extensions["none"] = extensions["none"] ? extensions["none"] + 1 : 1;
        });

        const extensionsSize = Object.keys(extensions).length;
        res.status(200);
        res["message"] = `${extensionsSize} type${extensionsSize > 1 ? "s" : ""} of extension found`;
        res["body"] = extensions;
        next();
    }

}

// Export router for injection in Express application
const Router = new MetricsRouter().router;
export { Router };
