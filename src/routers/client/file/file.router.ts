import { logger } from '@kobionic/server-lib';
import { NextFunction, Request, Response, Router } from 'express';
import { readFile as readFileLegacy, writeFile as writeFileLegacy } from 'fs';
import { promisify } from 'util';
import { URLParserService } from '../../../services';
const readFile = promisify(readFileLegacy);
const writeFile = promisify(writeFileLegacy);


const ROUTER_URL = '/file';
const router: Router = Router();
const urlParserService = URLParserService.Instance;

/**
 * Returns a file content as a string.
 *
 * @param {Request} req the Express request
 * @param {Response} res the Express response
 * @param {NextFunction} next the Express next function
 */
async function getFileContent(req: Request, res: Response, next: NextFunction): Promise<void> {
    const baseUrl = urlParserService.stripEndpointUrl(ROUTER_URL, req.url);
    try {
        const parsedUrl = await urlParserService.parse(baseUrl);

        if (!parsedUrl) {
            res.status(400);
            const err = new Error('A filepath must be provided in URL');
            return next(err);
        }
        const content = await readFile(parsedUrl.fullPath, 'utf8');
        res
            .contentType(parsedUrl.filename)
            .status(200)
            .send(content);
    } catch (err) {
        logger.error(`An error occured: ${err.message}`);
        res.status(err.code === 'ENOENT' ? 404 : err.code === 'FORBIDDEN' ? 403 : 500);
        next(err);
    }
}

/**
 * Modifies given file's content.
 *
 * @param {Request} req the Express request
 * @param {Response} res the Express response
 * @param {NextFunction} next the Express next function
 */
async function modifyFileContent(req: Request, res: Response, next: NextFunction): Promise<void> {
    const baseUrl = urlParserService.stripEndpointUrl(ROUTER_URL, req.url);
    try {
        const parsedUrl = await urlParserService.parse(baseUrl);

        if (!req.body) {
            res.status(400);
            const err = new Error('Request should have a body');
            return next(err);
        }

        await writeFile(parsedUrl.fullPath, req.body);
        res
            .status(200)
            .end();
    } catch (err) {
        logger.error(`An error occured: ${err.message}`);
        res.status(err.code === 'ENOENT' ? 404 : err.code === 'FORBIDDEN' ? 403 : 500);
        next(err);
    }
}

router
    .get(`${ROUTER_URL}/*`, getFileContent)
    .put(`${ROUTER_URL}/*`, modifyFileContent);

export {
    router,
};

