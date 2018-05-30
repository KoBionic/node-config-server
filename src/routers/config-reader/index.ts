import { logger } from '@kobionic/server-lib';
import { NextFunction, Request, Response, Router } from 'express';

import { ConfigRequest } from '../../models/config-request.model';
import { FileReaderService } from '../../services';
import { ServerUtil } from '../../utils';


/** The Express router. */
const router: Router = Router();

/** The File Reader service. */
const fileReaderService: FileReaderService = FileReaderService.Instance;

/**
 * Read file from given URL.
 *
 * @param {Request} req the Express request
 * @param {Response} res the Express response
 * @param {NextFunction} next the Express next function
 */
function readFileFromURL(req: Request, res: Response, next: NextFunction): void {
    // Parse request URL and returns an array of parts
    logger.debug('Original URL:', req.baseUrl);
    const url = req.baseUrl.replace(ServerUtil.API_URL, '');
    logger.debug('Formatted URL:', url);

    if (url.length > 1) {
        ConfigRequest
            .build(url)
            .then(configRequest => {
                if (!configRequest.filename) {
                    const msg = 'No filename provided';
                    logger.debug(msg);
                    res.status(400);
                    next(new Error(msg));

                } else {
                    const format = req.query.format
                        ? req.query.format.toLowerCase()
                        : undefined;

                    // Give file reader URL's first part as directory to look in and second as file to look for
                    return fileReaderService.readFile(configRequest.folderPath, configRequest.filename, format)
                        .then(obj => {
                            let returnedValue = obj;

                            configRequest.configFields.forEach(part => {
                                returnedValue = findValue(returnedValue, part);
                            });

                            if (returnedValue !== undefined) {
                                res
                                    .status(200)
                                    .send(normalize(returnedValue));

                            } else {
                                const msg = 'Requested property not found in file';
                                logger.debug(msg);
                                res.status(404);
                                next(new Error(msg));
                            }
                        });
                }
            })
            .catch(err => {
                logger.debug(err);
                // Return HTTP 404 status code if error is about a not found directory or file
                res.status(err.code === 'ENOENT' ? 404 : 500);
                next(err);
            });

    } else {
        const msg = 'Nothing to process';
        logger.debug(msg);
        res.status(400);
        next(new Error(msg));
    }
}

/**
 * Attempts to find the given property in the given object.
 *
 * @param {*} object the object to loop into
 * @param {string} property the looked for property
 * @returns {(any | undefined)} the looked for object or undefined if not found
 */
function findValue(object: any, property: string): any | undefined {
    return object && Object.keys(object).includes(property)
        ? object[property]
        : undefined;
}

/**
 * Normalizes a value to a string as certain types can generate an error when sent as is.
 *
 * @param {*} value the value to check
 * @returns {string} the normalized value
 */
function normalize(value: any): string {
    let normalized = value;

    // Convert a number to a string as it throws an error when sent as is
    if (typeof value === 'number') normalized = value.toString();

    return normalized;
}

router.get('/', readFileFromURL);

export default router;
