import { NextFunction, Request, Response, Router } from 'express';
import { FileReaderService, URLParserService } from '../../../services';
import { AppUtil, ErrorUtil } from '../../../utils';


const router = Router();
const fileReaderService = FileReaderService.Instance;
const urlParserService = URLParserService.Instance;

/**
 * Reads file from given URL.
 *
 * @param {Request} req the Express request
 * @param {Response} res the Express response
 * @param {NextFunction} next the Express next function
 */
function readFileFromURL(req: Request, res: Response, next: NextFunction): void {
    const baseUrl = urlParserService.stripEndpointUrl(AppUtil.API_URL, req.baseUrl);

    if (baseUrl.length > 1) {
        urlParserService
            .parse(baseUrl)
            .then(configRequest => {
                if (!configRequest.filename) {
                    ErrorUtil.handle('NO_FILENAME_PROVIDED', res, next);
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
                                ErrorUtil.handle('PROPERTY_NOT_FOUND', res, next);
                            }
                        });
                }
            })
            .catch(err => {
                ErrorUtil.handle(err, res, next);
            });
    } else {
        ErrorUtil.handle('NOTHING_TO_PROCESS', res, next);
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

router
    .get('/', readFileFromURL);

export {
    router,
};
