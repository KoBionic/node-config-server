import { EurekaClientRouter, EurekaClientService, logger } from '@kobionic/server-lib';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as helmet from 'helmet';
import * as http from 'http';

import { ErrorHandler } from './handlers';
import { ConfigReaderRouter } from './routers';
import { WSTransport } from './services';
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


    /**
     * Default constructor.
     *
     * @memberof NodeConfigServer
     */
    constructor() {
        this.app = express();
        this.app.set('port', ServerUtil.PORT);

        this.addMiddlewares();
        this.registerRoutes();
        this.app.use('/*', ErrorHandler);

        NodeConfigServer.server = http.createServer(this.app);

        // Add a WebSocket transport unless specified otherwise
        if (process.env.LOG_WEBSOCKET !== 'false') logger.addTransport(<any>WSTransport);

        // Start Eureka client only if EUREKA_CLIENT is set to true
        if (process.env.EUREKA_CLIENT === 'true') {
            const eureka = EurekaClientService.Instance;
            eureka.init(ServerUtil.HOST, ServerUtil.PORT);
            eureka.start();
        }
    }


    /**
     * Creates and starts a server.
     *
     * @returns {void}
     * @memberof NodeConfigServer
     */
    public start(): void {
        if (!AppUtil.canContinue()) {
            logger.error('Configuration folder is not valid');
            process.exit(1);
        }
        AppUtil.printAppInformation()
            .catch(err => logger.error(`an error occured: ${err.message}`));

        NodeConfigServer.server.listen(ServerUtil.PORT);
        NodeConfigServer.server.on('error', this.onError.bind(this));
        NodeConfigServer.server.on('listening', this.onListening.bind(this, ServerUtil.PORT));
    }

    /**
     * Adds Express middlewares to the application.
     *
     * @private
     * @memberof NodeConfigServer
     */
    private addMiddlewares(): void {
        if (process.env.CORS !== 'false') this.app.use(cors());
        if (process.env.SECURITY !== 'false') this.app.use(helmet());
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
        this.app.use('/eureka', EurekaClientRouter);
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
                logger.error(`Port ${ServerUtil.PORT} requires elevated privileges`);
                process.exit(1);
                break;

            case 'EADDRINUSE':
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
