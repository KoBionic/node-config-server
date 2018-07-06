import { NextFunction, Request, Response, Router } from 'express';
import { readFile as readFileLegacy, writeFile as writeFileLegacy } from 'fs';
import { promisify } from 'util';
import { URLParserService } from '../../../services';
import { ErrorUtil } from '../../../utils';
const readFile = promisify(readFileLegacy);
const writeFile = promisify(writeFileLegacy);


const FILE_ROUTER_URL = '/file';
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
    const baseUrl = urlParserService.stripEndpointUrl(FILE_ROUTER_URL, req.url);
    try {
        const parsedUrl = await urlParserService.parse(baseUrl);

        if (!parsedUrl || !parsedUrl.filename) {
            ErrorUtil.handle('NO_FILENAME_PROVIDED', res, next);

        } else {
            const content = await readFile(parsedUrl.fullPath, 'utf8');
            res
                .contentType(parsedUrl.filename)
                .status(200)
                .send(content);
        }
    } catch (err) {
        ErrorUtil.handle(err, res, next);
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
    const baseUrl = urlParserService.stripEndpointUrl(FILE_ROUTER_URL, req.url);
    try {
        const parsedUrl = await urlParserService.parse(baseUrl);

        if (!req.body || Object.keys(req.body).length === 0) {
            ErrorUtil.handle('REQUEST_BODY_INVALID', res, next);

        } else if (!parsedUrl || !parsedUrl.filename) {
            ErrorUtil.handle('NO_FILENAME_PROVIDED', res, next);

        } else {
            await writeFile(parsedUrl.fullPath, req.body.toString(), 'utf8');
            res
                .status(200)
                .end();
        }
    } catch (err) {
        ErrorUtil.handle(err, res, next);
    }
}

router
    .get(`${FILE_ROUTER_URL}*`, getFileContent)
    .put(`${FILE_ROUTER_URL}*`, modifyFileContent);

export {
    FILE_ROUTER_URL,
    router,
};
