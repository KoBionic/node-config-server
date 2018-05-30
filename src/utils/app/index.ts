import { AppInfoUtil, logger } from '@kobionic/server-lib';
import { statSync } from 'fs';
import * as path from 'path';

import { FsUtil } from '..';


/**
 * The application configuration directory, retrieved either by setting the *NODE_CONFIG_DIR*
 * environment variable or defaulting to *config* folder in current working directory.
 */
export const CONFIG_DIR = process.env.NODE_CONFIG_DIR
    ? path.resolve(process.env.NODE_CONFIG_DIR)
    : path.resolve(AppInfoUtil.ROOT_PATH, 'config');

/**
 * Logs useful information on the application such as configuration directory and some basic metrics.
 *
 * @export
 * @returns {Promise<void>}
 */
export async function printAppInformation(): Promise<void> {
    const files = await FsUtil.ls(CONFIG_DIR);
    const folders = files
        // Get directories from file paths
        .map(file => file.substring(0, file.lastIndexOf(path.sep)))
        .filter((folder, index, self) => {
            // Filter duplicates and folders identical to config root directory
            if (folder !== CONFIG_DIR) return self.indexOf(folder) === index;
        });

    const metrics = {
        path: CONFIG_DIR,
        files: files.length,
        folders: folders.length,
    };

    logger.info(`Config ${JSON.stringify(metrics, undefined, 2)}`);
}

/**
 * Determines whether or not the application is correctly configured and can start.
 *
 * @export
 * @returns {boolean} true if configuration is correct, false otherwise
 */
export function canContinue(): boolean {
    let go = true;

    try {
        const stats = statSync(CONFIG_DIR);
        stats.isDirectory() ? go = true : go = false;

    } catch (err) {
        go = false;
    }

    return go;
}
