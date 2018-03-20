import * as bodyParser from "body-parser";
import * as cluster from "cluster";
import * as cors from "cors";
import * as express from "express";
import * as helmet from "helmet";
import * as http from "http";

import { ClientRouter, ConfigReaderRouter, EurekaClientRouter } from "./routers";
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

        // Start Eureka client only if EUREKA_CLIENT is set to true
        if (process.env.EUREKA_CLIENT === "true") {
            Eureka.init(ServerUtil.HOST, ServerUtil.PORT);
            Eureka.start();
        }
    }


    /**
     * Creates and starts servers as workers, the number depending on the OS core threads.
     *
     * @private
     * @memberof NodeConfigServer
     */
    public start(): void {
        if (cluster.isMaster && process.env.NODE_ENV !== "development") {
            if (!AppUtil.canContinue()) {
                logger.error("Configuration folder is not valid");
                process.exit(1);
            }
            AppUtil.printAppInformation();
            logger.info(`Master ${process.pid} is running`);

            // Fork workers
            for (let step = 0; step < ServerUtil.getCpusNumber(); step++) {
                cluster.fork();
            }

            cluster.on("exit", (worker, code, signal) => {
                logger.error(`Worker ${worker.process.pid} died`);
            });

        } else {
            const server = http.createServer(this.app);
            server.listen(ServerUtil.PORT);
            server.on("error", this.onError.bind(this));
            server.on("listening", this.onListening.bind(this));
        }
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
        this.app.use(`${ServerUtil.API_URL}/*`, ConfigReaderRouter);
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
     * @memberof NodeConfigServer
     */
    private onListening(): void {
        logger.info(`Worker ${process.pid} listening on port ${ServerUtil.PORT}`);
    }

}
