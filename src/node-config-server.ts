import { EurekaClientRouter, EurekaClientService, logger } from '@kobionic/server-lib';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as helmet from 'helmet';
import * as http from 'http';

import { ErrorHandler } from './handlers';
import AppConfig from './models/config.model';
import { ConfigReaderRouter } from './routers';
import { ConfigService, WSTransport } from './services';
import { AppUtil, ServerUtil } from './utils';


/**
 * Creates and configures a Node Config server.
 *
 * @export
 * @class NodeConfigServer
 */
export class NodeConfigServer {

    /** The HTTP server. */
    public static server: http.Server;

    /** The Express Application instance. */
    public app: express.Application;

    private appConfig: AppConfig;
    private config: ConfigService;


    /**
     * Creates an instance of NodeConfigServer.
     *
     * @memberof NodeConfigServer
     */
    constructor() {
        this.config = ConfigService.Instance;
    }


    /**
     * Creates and starts a server.
     *
     * @returns {Promise<void>}
     * @memberof NodeConfigServer
     */
    public async start(): Promise<void> {
        await this.init();
        if (!AppUtil.canContinue(this.appConfig.baseDirectory)) {
            logger.error('Configuration folder is not valid');
            process.exit(1);
        }
        await AppUtil
            .printAppInformation()
            .catch(err => logger.error(`an error occured: ${err.message}`));

        NodeConfigServer.server.listen(this.appConfig.server.port);
        NodeConfigServer.server.on('error', this.onError.bind(this));
        NodeConfigServer.server.on('listening', this.onListening.bind(this, this.appConfig.server.port));
    }

    /**
     * Initializes server components.
     *
     * @private
     * @returns {Promise<void>}
     * @memberof NodeConfigServer
     */
    private async init(): Promise<void> {
        this.appConfig = await this.config.get();
        this.app = express();
        this.addMiddlewares();
        this.registerRoutes();
        this.app.use('/*', ErrorHandler);

        NodeConfigServer.server = http.createServer(this.app);

        // Add a WebSocket transport unless specified otherwise
        if (this.appConfig.logging['1'].enableWebsocket) logger.addTransport(<any>WSTransport);

        // Start Eureka client only if configuration is set to true
        if (this.appConfig.eureka['0']) {
            this.app.use('/eureka', EurekaClientRouter);
            const eureka = EurekaClientService.Instance;
            eureka.init(this.appConfig.server.host, this.appConfig.server.port);
            eureka.start();
        }
    }

    /**
     * Adds Express middlewares to the application.
     *
     * @private
     * @memberof NodeConfigServer
     */
    private addMiddlewares(): void {
        if (this.appConfig.security.enableCors) this.app.use(cors());
        if (this.appConfig.security.httpHeaders['0']) this.app.use(helmet(this.appConfig.security.httpHeaders['1']));
        this.app.use(logger.errorHTTPLogger());
        this.app.use(logger.infoHTTPLogger());
        this.app.use(bodyParser.json({ limit: '10mb' }));
        this.app.use(bodyParser.text({ limit: '10mb' }));
        this.app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));
    }

    /**
     * Registers all application routes.
     *
     * @private
     * @memberof NodeConfigServer
     */
    private registerRoutes(): void {
        this.app.use(`${ServerUtil.API_URL}/*`, ConfigReaderRouter);
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
                logger.error(`Port ${this.appConfig.server.port} requires elevated privileges`);
                process.exit(1);
                break;

            case 'EADDRINUSE':
                logger.error(`Port ${this.appConfig.server.port} is already in use`);
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
