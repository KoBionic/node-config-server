import { logger } from '@kobionic/server-lib';
import { Response, NextFunction } from 'express';


/** All available error types. */
const Type = {
    BAD_REQUEST: {
        message: 'Bad request',
        statusCode: 400,
    },
    ENOENT: {
        message: 'Requested resource not found',
        statusCode: 404,
    },
    FORBIDDEN: {
        message: 'Access to resource forbidden',
        statusCode: 403,
    },
    INTERNAL_SERVER_ERROR: {
        message: 'An internal server error occured',
        statusCode: 500,
    },
    NO_FILENAME_PROVIDED: {
        message: 'No filename provided',
        statusCode: 400,
    },
    NOT_FOUND: {
        message: 'Requested resource not found',
        statusCode: 404,
    },
    NOTHING_TO_PROCESS: {
        message: 'Nothing to process',
        statusCode: 400,
    },
    PROPERTY_NOT_FOUND: {
        message: 'Requested property not found in file',
        statusCode: 404,
    },
    REQUEST_BODY_INVALID: {
        message: 'Invalid request body',
        statusCode: 400,
    },
};

/**
 * Handles any type of error.
 *
 * @param {CustomError} err the error to handle
 * @param {Response} res the Express response used to respond to client
 * @param {NextFunction} next the Express next function used to go to next middleware
 * @param {boolean} [warning=false] true if logging output should be a warning, false if should be an error
 */
function handle(err: keyof typeof Type | Error, res: Response, next: NextFunction, message?: string, warning: boolean = false): void {
    const errorType = err && Type[err['code'] || err] || Type.INTERNAL_SERVER_ERROR;
    const log = warning ? logger.warn : logger.error;
    const msg = message ? message : errorType.message;
    const error = new Error(msg);

    if (error.stack) logger.debug(err instanceof Error ? err.stack : error.stack);
    log(msg);
    res.status(errorType.statusCode);
    next(error);
}

export {
    Type,
    handle,
};
