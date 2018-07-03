import { logger } from '@kobionic/server-lib';
import * as fs from 'fs';
import { hostname } from 'os';
import { basename, extname, join, resolve, sep } from 'path';
import { promisify } from 'util';
import { API_URL } from '../../routers';
import { ConfigurationService } from '../../services';
import { Tree } from './tree.type';
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);


/**
 * Content service.
 *
 * @export
 * @class ContentService
 */
export class ContentService {

    private static _instance: ContentService;
    private confService: ConfigurationService;


    /**
     * Creates an instance of ContentService.
     *
     * @memberof ContentService
     */
    private constructor() {
        this.confService = ConfigurationService.Instance;
    }


    /**
     * Returns a singleton instance of the service.
     *
     * @readonly
     * @static
     * @type {ContentService}
     * @memberof ContentService
     */
    public static get Instance(): ContentService {
        return ContentService._instance || (ContentService._instance = new ContentService());
    }

    /**
     * Returns a directory Tree object from configuration folder.
     *
     * @returns {Promise<Tree>} the Tree object generated from configuration folder
     * @memberof ContentService
     */
    public async getTree(): Promise<Tree> {
        const tree = await this.generateTree(this.confService.config.baseDirectory);
        return tree;
    }

    /**
     * Recursively generates a Tree object from given path.
     *
     * @private
     * @param {string} path the path to generate Tree from
     * @returns {Promise<Tree>} the generated Tree object
     * @memberof ContentService
     */
    private async generateTree(path: string): Promise<Tree> {
        let item;
        const name = basename(path);
        const publicPath = path.replace(`${resolve(this.confService.config.baseDirectory, '..')}${sep}`, '');
        const fileUrl = path.replace(`${resolve(this.confService.config.baseDirectory)}${sep}`, '');

        try {
            const stats = await stat(path);
            if (stats.isFile()) {
                const ext = extname(path).toLowerCase();
                item = {
                    path: publicPath,
                    name: name,
                    type: 'file',
                    size: stats.size,
                    extension: ext.substring(1, ext.length),
                    url: `${this.confService.config.server.scheme}://${hostname().toLowerCase()
                        }:${this.confService.config.server.port}${API_URL}/${fileUrl}`,
                };
            } else if (stats.isDirectory()) {
                const nodes = await readdir(path);
                if (nodes) {
                    const promises = nodes.map(async child => this.generateTree(join(path, child)));
                    const children = (await Promise.all(promises)).filter(child => !!child);
                    item = {
                        path: publicPath,
                        name: name,
                        type: 'directory',
                        size: children.reduce((prev, cur) => prev + cur.size, 0),
                        children: children,
                    };
                }
            }
        } catch (err) {
            logger.error(`An error occured: ${err.message}`);
            item = undefined;
        }
        return item;
    }

}
