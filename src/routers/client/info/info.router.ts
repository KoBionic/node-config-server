import { resolve as rootResolve } from 'app-root-path';
import { NextFunction, Request, Response, Router } from 'express';
import { readFile as readFileLegacy } from 'fs';
import { promisify } from 'util';
import { ErrorUtil } from '../../../utils';
const readFile = promisify(readFileLegacy);


const INFO_ROUTER_URL = '/info';
const router: Router = Router();
let packageJson;

/**
 * Returns information about the server.
 *
 * @param {Request} req the Express request
 * @param {Response} res the Express response
 * @param {NextFunction} next the Express next function
 */
async function getInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const pkg = await getPackageJson();
        const info = {
            homepage: pkg.homepage,
            issuesTracker: pkg.bugs.url,
            pid: process.pid,
            uptime: Math.floor(process.uptime()) * 1000, // Uptime in ms
            version: pkg.version,
        };
        res
            .status(200)
            .json(info);
    } catch (err) {
        ErrorUtil.handle(err, res, next);
    }
}

/**
 * Returns the package.json object, the 1st time from file & from memory on subsequent calls.
 *
 * @returns {Promise<any>} the package.json object
 */
async function getPackageJson(): Promise<any> {
    return packageJson || (packageJson = JSON.parse(await readFile(rootResolve('package.json'), 'utf8')));
}

router
    .get(INFO_ROUTER_URL, getInfo);

export {
    INFO_ROUTER_URL,
    router,
};
