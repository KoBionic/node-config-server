import { readFileSync, statSync } from "fs";
import * as moment from "moment";
import * as path from "path";

import { FsUtil } from "..";
import { logger } from "../../services";


/** Date format used for logging. */
export const DATE_FORMAT = "YYYY-MM-DD HH:mm:ss.SSS";

/** Morgan HTTP Logger format. */
export const HTTP_FORMAT = ":method :url :status :response-time ms :remote-addr - :user-agent";

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

/**
 * Returns a formatted timestamp.
 *
 * @export
 * @returns {string} the formatted timestamp as a string
 */
export function timestamp(): string {
    return moment(Date.now()).format(DATE_FORMAT);
}

/**
 * Retrieves the application name from the package.json. Scope is removed by default.
 *
 * @export
 * @param {boolean} [scoped=false] set to true if scope needs to be left in the resulting string
 * @returns {string} the application name
 */
export function getAppName(scoped: boolean = false): string {
    const scopeRegExp = /^@.+\//;

    const json = readFileSync(path.resolve(__dirname, "..", "package.json"), "utf8");
    let name: string = JSON.parse(json).name;

    if (!scoped) name = name.replace(scopeRegExp, "");

    return name;
}

/**
 * Retrieves the application description from the package.json.
 *
 * @export
 * @returns {string} the application description
 */
export function getAppDescription(): string {
    const json = readFileSync(path.resolve(__dirname, "..", "package.json"), "utf8");

    return JSON.parse(json).description;
}
