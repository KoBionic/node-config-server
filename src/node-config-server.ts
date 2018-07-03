import { ErrorHandler, EurekaClientRouter, EurekaClientService, httpLogger, logger, WSTransport } from '@kobionic/server-lib';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as helmet from 'helmet';
import * as http from 'http';
import * as ms from 'ms';
import { hostname } from 'os';
import { APIRouter, ClientRouter } from './routers';
import { ConfigurationService } from './services';
import { AppUtil } from './utils';


/**
 * Creates and configures a Node Config server.
 *
 * @export
 * @class NodeConfigServer
 */
export class NodeConfigServer {

    /** The Express Application instance. */
    public app: express.Application;

    private confService: ConfigurationService;
    private server: http.Server;
    private startTime: number;


    /**
     * Creates an instance of NodeConfigServer.
     *
     * @memberof NodeConfigServer
     */
    constructor() {
        this.startTime = Date.now();
        this.confService = ConfigurationService.Instance;
    }


    /**
     * Creates and starts a server.
     *
     * @returns {Promise<void>}
     * @memberof NodeConfigServer
     */
    public async start(): Promise<void> {
        await this.init();
        this.server.listen(this.confService.config.server.port);
        this.server.on('error', this.onError.bind(this));
        this.server.on('listening', this.onListening.bind(this, this.confService.config.server.port));
    }

    /**
     * Initializes server components.
     *
     * @returns {Promise<NodeConfigServer>} chainable instance of NodeConfigServer
     * @memberof NodeConfigServer
     */
    public async init(): Promise<NodeConfigServer> {
        this.app = express();

        if (!AppUtil.canContinue(this.confService.config.baseDirectory)) {
            logger.error('Configuration folder is not valid');
            process.exit(1);
        }
        await AppUtil
            .printAppInformation()
            .catch(err => logger.error(`An error occured: ${err.message}`));

        this.addMiddlewares();
        await this.registerRoutes();
        this.app.use('/*', ErrorHandler);

        this.server = http.createServer(this.app);

        // Add a WebSocket transport unless specified otherwise
        if (this.confService.config.logging[1].enableWebsocket) logger.add(new WSTransport(this.server, 'serverLog'));

        // Start Eureka client only if configuration is set to true
        if (this.confService.config.eureka[0]) {
            this.app.use('/eureka', EurekaClientRouter);
            const eureka = EurekaClientService.Instance;
            eureka.init(hostname().toLowerCase(), this.confService.config.server.port);
            eureka.start();
        }
        return this;
    }

    /**
     * Adds Express middlewares to the application.
     *
     * @private
     * @memberof NodeConfigServer
     */
    private addMiddlewares(): void {
        if (this.confService.config.security.enableCors) this.app.use(cors());
        if (this.confService.config.security.httpHeaders['0']) this.app.use(helmet(this.confService.config.security.httpHeaders['1']));
        this.app.use(httpLogger());
        this.app.use(bodyParser.json({ limit: '10mb' }));
        this.app.use(bodyParser.text({ limit: '10mb' }));
        this.app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));
    }

    /**
     * Registers all application routes.
     *
     * @private
     * @returns {Promise<void>}
     * @memberof NodeConfigServer
     */
    private async registerRoutes(): Promise<void> {
        this.app.use(APIRouter);
        this.app.use(ClientRouter);
        this.app.use('/*', (req, res, next) => {
            res.status(404);
            next(new Error(`Requested resource ${req.originalUrl} not found`));
        });
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
            case 'EACCES':
                logger.error(`Port ${this.confService.config.server.port} requires elevated privileges`);
                process.exit(1);
                break;
            case 'EADDRINUSE':
                logger.error(`Port ${this.confService.config.server.port} is already in use`);
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
        logger.info(`Server started in ${ms(Date.now() - this.startTime)}`);
    }

}
