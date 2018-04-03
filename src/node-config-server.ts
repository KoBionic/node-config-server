import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as express from "express";
import * as helmet from "helmet";
import * as http from "http";

import { ClientResponseHandler, ErrorHandler } from "./handlers";
import { ClientRouter, ConfigReaderRouter, EurekaClientRouter, MetricsRouter } from "./routers";
import { Eureka, logger } from "./services";
import { AppUtil, ServerUtil } from "./utils";


/**
 * Creates and configures a Node Config server.
 *
 * @export
 * @class NodeConfigServer
 */
export class NodeConfigServer {

    /** The Express Application instance. */
    public app: express.Application;


    /**
     * Default constructor.
     *
     * @memberof NodeConfigServer
     */
    constructor() {
        this.app = express();
        this.app.set("port", ServerUtil.PORT);

        this.addMiddlewares();
        this.registerRoutes();
        this.attachHandlers();

        // Start Eureka client only if EUREKA_CLIENT is set to true
        if (process.env.EUREKA_CLIENT === "true") {
            Eureka.init(ServerUtil.HOST, ServerUtil.PORT);
            Eureka.start();
        }
    }


    /**
     * Creates and starts a server.
     *
     * @returns {Promise<void>}
     * @memberof NodeConfigServer
     */
    public async start(): Promise<void> {
        if (!AppUtil.canContinue()) {
            logger.error("Configuration folder is not valid");
            process.exit(1);
        }
        await AppUtil.printAppInformation();

        const server = http.createServer(this.app);
        server.listen(ServerUtil.PORT);
        server.on("error", this.onError.bind(this));
        server.on("listening", this.onListening.bind(this, ServerUtil.PORT));
    }

    /**
     * Adds Express middlewares to the application.
     *
     * @private
     * @memberof NodeConfigServer
     */
    private addMiddlewares(): void {
        if (process.env.CORS !== "false") this.app.use(cors());
        if (process.env.SECURITY !== "false") this.app.use(helmet());
        this.app.use(logger.getErrorHTTPLogger());
        this.app.use(logger.getInfoHTTPLogger());
        this.app.use(bodyParser.json({ limit: "10mb" }));
        this.app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));
    }

    /**
     * Registers all application routes.
     *
     * @private
     * @memberof NodeConfigServer
     */
    private registerRoutes(): void {
        this.app.use("/", EurekaClientRouter);
        this.app.use(ServerUtil.UI_CLIENT_URL, ClientRouter);
        this.app.use(`${ServerUtil.UI_CLIENT_URL}/metrics`, MetricsRouter);
        this.app.use(`${ServerUtil.API_URL}/*`, ConfigReaderRouter);
    }

    /**
     * Attaches custom middelwares to the application routes.
     *
     * @private
     * @memberof NodeConfigServer
     */
    private attachHandlers(): void {
        this.app.use("/*", ClientResponseHandler);
        this.app.use("/*", ErrorHandler);
    }

    /**
     * Handles any error event.
     *
     * @private
     * @param {NodeJS.ErrnoException} error the error to handle
     * @memberof NodeConfigServer
     */
    private onError(error: NodeJS.ErrnoException): void {
        switch (error.code) {
            case "EACCES":
                logger.error(`Port ${ServerUtil.PORT} requires elevated privileges`);
                process.exit(1);
                break;

            case "EADDRINUSE":
                logger.error(`Port ${ServerUtil.PORT} is already in use`);
                process.exit(1);
                break;

            default:
                throw error;
        }
    }

    /**
     * Executes some actions on server listening event.
     *
     * @private
     * @param {number} port the port that is being listened to
     * @memberof NodeConfigServer
     */
    private onListening(port: number): void {
        logger.info(`Server listening on port ${port}`);
    }

}
