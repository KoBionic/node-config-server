import { Container, Services } from "./inversify.config";
import { LoggerService } from "./services/logger/logger.service";
import { EurekaClientService } from "./services/eureka-client/eureka-client.service";
import { Router as EurekaClientRouter } from "./routers/eureka-client/eureka-client.router";
import { Router as ConfigReaderRouter } from "./routers/config-reader/config-reader.router";
import * as bodyParser from "body-parser";
import * as cluster from "cluster";
import * as express from "express";
import * as http from "http";
import * as os from "os";
import * as path from "path";
import * as serveFavicon from "serve-favicon";


/**
 * Creates and configures a Node Config server.
 *
 * @export
 * @class NodeConfigServer
 */
export class NodeConfigServer {

    /** The API URL. */
    public static readonly API_URL: string = "/api/v1";

    /** The Express Application instance. */
    public app: express.Application;

    /** The server hostname. */
    public host: string;

    /** The server port number. */
    public port: string | number;

    /** The application logger. */
    private logger: LoggerService;

    /** The Eureka client service. */
    private eureka: EurekaClientService;


    /**
     * Default constructor.
     *
     * @memberof NodeConfigServer
     */
    constructor() {
        this.app = express();
        this.host = os.hostname();
        this.port = process.env.PORT || 20490;
        this.app.set("port", this.port);

        this.logger = Container.get(Services.LOGGER);
        this.eureka = Container.get(Services.EUREKA);

        this.configure();
        this.routes();

        // Start Eureka client only if EUREKA_CLIENT is set to true
        if (process.env.EUREKA_CLIENT === "true") {
            this.eureka.init(this.host, this.port);
            this.eureka.start();
        }
    }


    /**
     * Creates and starts servers as workers, the number depending on the OS core threads.
     *
     * @private
     * @memberof NodeConfigServer
     */
    public start(): void {
        if (cluster.isMaster) {
            this.logger.info(`master ${process.pid} is running`);

            // Fork workers
            os.cpus().forEach(cpu => {
                cluster.fork();
            });

            cluster.on("exit", (worker, code, signal) => {
                this.logger.error(`worker ${worker.process.pid} died`);
            });

        } else {
            const server = http.createServer(this.app);
            server.listen(this.port);
            server.on("error", this.onError.bind(this));
            server.on("listening", this.onListening.bind(this));
        }
    }

    /**
     * Configures application.
     *
     * @private
     * @memberof NodeConfigServer
     */
    private configure(): void {
        this.app.use(this.logger.getErrorHTTPLogger());
        this.app.use(this.logger.getInfoHTTPLogger());
        this.app.use(bodyParser.json({ limit: "10mb" }));
        this.app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));
        this.app.use(serveFavicon(path.join(__dirname, "public", "favicon.ico")));
    }

    /**
     * Registers all application routes.
     *
     * @private
     * @memberof NodeConfigServer
     */
    private routes(): void {
        this.app.use("/", EurekaClientRouter);
        this.app.use(`${NodeConfigServer.API_URL}/*`, ConfigReaderRouter);
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
                this.logger.error(`port ${this.port} requires elevated privileges`);
                process.exit(1);
                break;

            case "EADDRINUSE":
                this.logger.error(`port ${this.port} is already in use`);
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
        this.logger.info(`worker ${process.pid} listening on port ${this.port}`);
    }

}
