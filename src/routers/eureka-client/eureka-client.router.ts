import { GenericRouter } from "../generic.router";
import { Eureka } from "../../services/eureka-client";
import * as express from "express";


/**
 * Eureka client router.
 *
 * @class EurekaClientRouter
 * @extends {GenericRouter}
 */
class EurekaClientRouter extends GenericRouter {

    /** The Configuration Reader Express router. */
    public router: express.Router;


    /**
     * Default constructor.
     *
     * @memberof EurekaClientRouter
     */
    constructor() {
        super();
        this.router = express.Router();
        this.registerRoutes();
    }


    /**
     * Initializes routes by adding them to the router.
     *
     * @memberof EurekaClientRouter
     */
    public registerRoutes(): void {
        this.router.get("/health", this.health.bind(this));
        this.router.get("/info", this.info.bind(this));
    }

    /**
     * Returns the Eureka client health check object.
     *
     * @private
     * @param {express.Request} req the Express request
     * @param {express.Response} res the Express response
     * @param {express.NextFunction} next the Express next function
     * @memberof EurekaClientRouter
     */
    private health(req: express.Request, res: express.Response, next: express.NextFunction): void {
        res
            .status(200)
            .send(Eureka.getHealthCheck());
    }

    /**
     * Returns the Eureka client information object.
     *
     * @private
     * @param {express.Request} req the Express request
     * @param {express.Response} res the Express response
     * @param {express.NextFunction} next the Express next function
     * @memberof EurekaClientRouter
     */
    private info(req: express.Request, res: express.Response, next: express.NextFunction): void {
        res
            .status(200)
            .send(Eureka.getInfo());
    }

}

// Export router for injection in Express application
const Router = new EurekaClientRouter().router;
export { Router };
