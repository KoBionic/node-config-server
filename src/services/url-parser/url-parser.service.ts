import { logger } from '@kobionic/server-lib';
import { stat } from 'fs';
import { join, resolve } from 'path';
import { promisify } from 'util';
import { ConfigurationService } from '..';
import { ConfigRequest } from './config-request.type';
const statAsync = promisify(stat);


/**
 * URL parsing service used to create ConfigRequest objects from an URL.
 *
 * @export
 * @class URLParserService
 */
export class URLParserService {

    private static _instance: URLParserService;
    private readonly urlPartsRegExp: RegExp = /([^\/]+)/g;
    private readonly confService: ConfigurationService;


    /**
     * Creates an instance of URLParserService.
     *
     * @memberof URLParserService
     */
    private constructor() {
        this.confService = ConfigurationService.Instance;
    }


    /**
     * Returns a singleton instance of the service.
     *
     * @readonly
     * @static
     * @type {URLParserService}
     * @memberof URLParserService
     */
    public static get Instance(): URLParserService {
        return URLParserService._instance || (URLParserService._instance = new URLParserService());
    }

    /**
     * Parses given URL and returns a ConfigRequest object from it.
     *
     * @param {string} url the URL to create a ConfigRequest object from
     * @returns {Promise<ConfigRequest>} the created ConfigRequest object
     * @memberof URLParserService
     */
    public async parse(url: string): Promise<ConfigRequest> {
        const configRequest = await this.createConfigRequest(url);
        return Promise.resolve(configRequest);
    }

    /**
     * Removes given endpoint part from given URL.
     *
     * @param {string} baseUrl the endpoint URL
     * @param {string} url the URL to strip of endpoint URL
     * @returns {string} the formatted URL
     * @memberof URLParserService
     */
    public stripEndpointUrl(baseUrl: string, url: string): string {
        logger.debug(`Original URL: ${url}`);
        const formattedUrl = url.replace(baseUrl, '');
        logger.debug(`Formatted URL: ${url}`);
        return formattedUrl;
    }

    /**
     * Creates a ConfigRequest object from given URL.
     *
     * @private
     * @param {string} url the URL to create a ConfigRequest object from
     * @returns {Promise<ConfigRequest>} the created ConfigRequest object
     * @memberof URLParserService
     */
    private async createConfigRequest(url: string): Promise<ConfigRequest> {
        // Do not continue if URL is undefined
        if (!url) return undefined;

        let configFields;
        let filename;
        let folderPath;

        const parsedUrl = url.match(this.urlPartsRegExp);
        logger.debug(`URL segments: ${parsedUrl}`);
        const baseDir = resolve(this.confService.config.baseDirectory);
        let pathToFolder = baseDir;

        while (parsedUrl.length) {
            pathToFolder = join(pathToFolder, parsedUrl.shift());

            // Security check forbidding retrieval of a file from parent context
            if (!pathToFolder.includes(baseDir)) {
                const err = new Error('Getting a file from parent context is forbidden');
                err['code'] = 'FORBIDDEN';
                throw err;
            }

            // Check if folder is a directory
            const isFolder = (await statAsync(pathToFolder)).isDirectory();
            if (isFolder) {
                // Set folder path if sequence is a folder
                folderPath = pathToFolder;
            } else {
                // Set folder path & filename if sequence ends with a file and get out of loop
                const parts = pathToFolder.split('/');
                filename = parts.pop();
                folderPath = parts.join('/');
                break;
            }
        }
        configFields = parsedUrl;
        logger.debug(`ConfigRequest ${JSON.stringify(
            {
                directory: folderPath,
                filename: filename,
                fields: configFields,
            },
            undefined, 2)}`);

        return {
            configFields: configFields,
            filename: filename,
            folderPath: folderPath,
            fullPath: filename ? join(folderPath, filename) : folderPath,
        };
    }

}
