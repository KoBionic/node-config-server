import { readdirSync, statSync } from "fs";
import * as path from "path";

import { logger } from "../../services";


/**
 * The application configuration directory, retrieved either by setting the *NODE_CONFIG_DIR*
 * environment variable or defaulting to *config* folder in current working directory.
 */
export const CONFIG_DIR = process.env.NODE_CONFIG_DIR
    ? path.resolve(process.env.NODE_CONFIG_DIR)
    : path.resolve("config");

/**
 * Logs useful information on the application such as configuration directory and some basic metrics.
 *
 * @export
 */
export function printAppInformation(): void {
    const files = ls(CONFIG_DIR);
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
 * Recursively looks for files in a given directory in a synchronous way.
 *
 * @export
 * @param {string} directory the directory to look in for files
 * @param {Array<string>} [content] the content to keep beetween recursive calls
 * @returns {Array<string>} the list of files
 */
export function ls(directory: string, content?: Array<string>): Array<string> {
    let list = content || [];

    for (const node of readdirSync(directory)) {
        const nodePath = `${directory}${path.sep}${node}`;
        const stats = statSync(nodePath);

        stats.isDirectory()
            // Recursive call if node is a directory
            ? list = ls(nodePath, list)
            : list.push(nodePath);
    }

    return list;
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
