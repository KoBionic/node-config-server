import { GenericRouter } from "../generic.router";
import { Container, Services } from "../../inversify.config";
import { ConfigRequest } from "../../models/config-request.model";
import { NodeConfigServer } from "../../node-config-server";
import { LoggerService } from "../../services/logger/logger.service";
import { FileReaderService } from "../../services/file-reader/file-reader.service";
import * as express from "express";


/**
 * Configuration Reader router.
 *
 * @class ConfigReaderRouter
 * @extends {GenericRouter}
 */
class ConfigReaderRouter extends GenericRouter {

    /** The Configuration Reader Express router. */
    public router: express.Router;

    /** The file reader service. */
    private fileReaderService: FileReaderService;

    /** The application logger. */
    private logger: LoggerService;


    /**
     * Default constructor.
     *
     * @memberof ConfigReaderRouter
     */
    constructor() {
        super();
        this.router = express.Router();
        this.fileReaderService = Container.get(Services.FILE_READER);
        this.logger = Container.get(Services.LOGGER);
        this.registerRoutes();
    }


    /**
     * Initializes routes by adding them to the router.
     *
     * @memberof ConfigReaderRouter
     */
    public registerRoutes(): void {
        this.router.get("/", this.readFileFromURL.bind(this));
    }

    /**
     * Read file from given URL.
     *
     * @private
     * @param {express.Request} req the Express request
     * @param {express.Response} res the Express response
     * @param {express.NextFunction} next the Express next function
     * @memberof ConfigReaderRouter
     */
    private readFileFromURL(req: express.Request, res: express.Response, next: express.NextFunction): void {
        // Parse request URL and returns an array of parts
        this.logger.debug("Original URL:", req.originalUrl);
        const url = req.originalUrl.replace(NodeConfigServer.API_URL, "");
        this.logger.debug("Formatted URL:", url);

        if (url.length > 1) {
            ConfigRequest
                .build(url)
                .then(configRequest => {
                    if (!configRequest.filename) {
                        this.logger.debug("No filename provided");
                        res
                            .status(400)
                            .end();

                    } else {
                        // Give file reader URL's first part as directory to look in and second as file to look for
                        return this.fileReaderService.readFile(configRequest.folderPath, configRequest.filename)
                            .then(obj => {
                                let returnedValue = obj;

                                configRequest.configFields.forEach(part => {
                                    returnedValue = this.findValue(returnedValue, part);
                                });

                                res
                                    .status(returnedValue !== undefined ? 200 : 404)
                                    .send(this.normalize(returnedValue));
                            });
                    }
                })
                .catch(reason => {
                    this.logger.debug(reason);
                    // Return HTTP 404 status code if error is about a not found directory or file
                    res
                        .status(reason.code === "ENOENT" ? 404 : 500)
                        .end();
                });

        } else {
            this.logger.debug("Nothing to process");
            res
                .status(400)
                .end();
        }
    }

    /**
     * Attempts to find the given property in the given object.
     *
     * @private
     * @param {*} object the object to loop into
     * @param {string} property the looked for property
     * @returns {(any | undefined)} the looked for object or undefined if not found
     * @memberof ConfigReaderRouter
     */
    private findValue(object: any, property: string): any | undefined {
        if (object && Object.keys(object).includes(property)) {
            return object[property];

        } else {
            return undefined;
        }
    }

    /**
     * Normalizes a value to a string as certain types can generate an error when sent as is.
     *
     * @private
     * @param {*} value the value to check
     * @returns {string} the normalized value
     * @memberof ConfigReaderRouter
     */
    private normalize(value: any): string {
        let normalized = value;

        // Convert a number to a string as it throws an error when sent as is
        if (typeof value === "number") normalized = value.toString();

        return normalized;
    }

}

// Export router for injection in Express application
const Router = new ConfigReaderRouter().router;
export { Router };
