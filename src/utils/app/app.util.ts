import { logger } from '@kobionic/server-lib';
import { statSync } from 'fs';
import * as globStream from 'glob';
import { resolve, sep } from 'path';
import { promisify } from 'util';
import { ConfigurationService } from '../../services';
const glob = promisify(globStream);


const confService = ConfigurationService.Instance;

/** The endpoints version tag. */
export const ENDPOINTS_VERSION: string = 'v1';

/**
 * Logs useful information on the application such as configuration directory and some basic metrics.
 *
 * @export
 * @returns {Promise<void>}
 */
export async function printAppInformation(): Promise<void> {
    const baseDirectory = resolve(confService.config.baseDirectory);

    const files = await glob(`${baseDirectory}/**/*`);
    const folders = files
        // Get directories from file paths
        .map(file => file.substring(0, file.lastIndexOf(sep)))
        .filter((folder, index, self) => {
            // Filter duplicates and folders identical to config root directory
            if (folder !== baseDirectory) return self.indexOf(folder) === index;
        });
    const metrics = {
        path: baseDirectory,
        files: files.length,
        folders: folders.length,
    };
    logger.info(`Directory ${JSON.stringify(metrics, undefined, 2)}`);
}

/**
 * Determines whether or not the application is correctly configured and can start.
 *
 * @export
 * @param {string} baseDirectory the configuration files base directory
 * @returns {boolean} true if directory configuration is correct, false otherwise
 */
export function canContinue(baseDirectory: string): boolean {
    let go = true;

    try {
        const stats = statSync(baseDirectory);
        stats.isDirectory() ? go = true : go = false;
    } catch (err) {
        go = false;
    }
    return go;
}
