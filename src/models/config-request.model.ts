import { logger } from '@kobionic/server-lib';
import { stat } from 'fs';
import * as path from 'path';
import { promisify } from 'util';

import { ConfigService } from '../services';

const statAsync = promisify(stat);


/**
 * Creates a configuration request from analyzed URL.
 *
 * @export
 * @class ConfigRequest
 */
export class ConfigRequest {

    /** The folder path to read file from. */
    public folderPath: string;

    /** The file name. */
    public filename: string;

    /** The configuration fields to look for in the file. */
    public configFields: string[];

    private readonly urlPartsRegExp: RegExp = /([^\/]+)/g;
    private readonly url: string;
    private config: ConfigService;


    /**
     * Creates an instance of ConfigRequest.
     *
     * @param {string} url the URL to parse
     * @memberof ConfigRequest
     */
    private constructor(url: string) {
        this.config = ConfigService.Instance;
        this.url = url;
    }


    /**
     * Creates an instance of Config Request with given URL.
     *
     * @static
     * @param {string} url the URL to create an instance from
     * @returns {Promise<ConfigRequest>} the created instance of ConfigRequest
     * @memberof ConfigRequest
     */
    public static async build(url: string): Promise<ConfigRequest> {
        const cR = new ConfigRequest(url);
        await cR.setFields();

        return Promise.resolve(cR);
    }

    /**
     * Sets configuration request properties from instance URL.
     *
     * @private
     * @memberof ConfigRequest
     */
    private async setFields(): Promise<void> {
        const parsedUrl = this.url.match(this.urlPartsRegExp);
        logger.debug('Parsed URL:', parsedUrl.join('/'));
        const appConfig = await this.config.get();

        let pathToFolder = path.resolve(appConfig.baseDirectory);

        while (parsedUrl.length) {
            pathToFolder = path.join(pathToFolder, parsedUrl.shift());
            logger.debug('Part:', pathToFolder);

            // Check if folder is a directory
            const isFolder = (await statAsync(pathToFolder)).isDirectory();
            if (isFolder) {
                // Set folder path if sequence is a folder
                this.folderPath = pathToFolder;
            } else {
                // Set folder path & filename if sequence ends with a file and get out of loop
                const parts = pathToFolder.split('/');
                this.filename = parts.pop();
                this.folderPath = parts.join('/');
                break;
            }
        }
        this.configFields = parsedUrl;
        logger.debug('Folder path:', this.folderPath);
        logger.debug('Filename:', this.filename);
        logger.debug('Config fields:', this.configFields.join('/'));
    }

}
