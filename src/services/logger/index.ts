import { RequestHandler } from "express";
import { promisify } from "util";
import { v1 as uuid } from "uuid";
import * as fs from "fs";
import * as moment from "moment";
import * as morgan from "morgan";
import * as path from "path";
import * as winston from "winston";
const mkdir = promisify(fs.mkdir);
const stat = promisify(fs.stat);


// Service identifier used in logs
const correlationId = uuid();
const showId = process.env.LOG_PRINT_ID === "true" ? true : false;

// Date format used for logging
const DATE_FORMAT = "YYYY-MM-DD HH:mm:ss.SSS";

// Morgan HTTP Logger format
const HTTP_FORMAT = ":method :url :status :response-time ms :remote-addr - :user-agent";

const loggerName = process.env.LOG_NAME || "node-config-server";
const filename = `${loggerName}_${moment(Date.now()).format("YYYY-MM-DD")}.log`;

// Default to create logs directory in app root path if not present
const logDir = process.env.LOG_DIR || path.resolve(__dirname, "..", "logs");
stat(logDir)
    .catch(err => {
        mkdir(logDir);
    });

winston.configure({
    level: process.env.LOG_LEVEL || "info",
    transports: [
        new winston.transports.File({
            filename: `${process.env.LOG_DIR || "./logs"}/${filename}`,
            json: true,
            maxsize: 5242880, // 5Mb
            maxFiles: 5,
            timestamp: () => moment().format(DATE_FORMAT)
        }),
        new winston.transports.Console({
            formatter: options => formatter(options),
            timestamp: () => moment().format(DATE_FORMAT)
        })
    ]
});

/**
 * Prints a message on the console with the defined level.
 *
 * @export
 * @param {string} level the logging level
 * @param {...Array<any>} messages the messages to log
 */
export function log(level: string, ...messages: Array<any>): void {
    winston.log(level, messages.join(" "));
}

/**
 * Prints a debug message on the console.
 *
 * @export
 * @param {...Array<any>} messages the messages to log
 */
export function debug(...messages: Array<any>): void {
    winston.log("debug", messages.join(" "));
}

/**
 * Prints an error message on the console.
 *
 * @export
 * @param {...Array<any>} messages the messages to log
 */
export function error(...messages: Array<any>): void {
    winston.log("error", messages.join(" "));
}

/**
 * Prints an info message on the console.
 *
 * @export
 * @param {...Array<any>} messages the messages to log
 */
export function info(...messages: Array<any>): void {
    winston.log("info", messages.join(" "));
}

/**
 * Prints a warn message on the console.
 *
 * @export
 * @param {...Array<any>} messages the messages to log
 */
export function warn(...messages: Array<any>): void {
    winston.log("warn", messages.join(" "));
}

/**
 * Returns an Express RequestHandler error logger using streamed Morgan HTTP logger passed through Winston logger.
 *
 * @export
 * @returns {RequestHandler} an Express RequestHandler error logger
 */
export function getErrorHTTPLogger(): RequestHandler {
    return morgan(HTTP_FORMAT, {
        skip: (req, res) => res.statusCode < 400,
        stream: {
            write: message => {
                error(message.trim());
            }
        }
    });
}

/**
 * Returns an Express RequestHandler info logger using streamed Morgan HTTP logger passed through Winston logger.
 *
 * @export
 * @returns {RequestHandler} an Express RequestHandler info logger
 */
export function getInfoHTTPLogger(): RequestHandler {
    return morgan(HTTP_FORMAT, {
        skip: (req, res) => res.statusCode >= 400,
        stream: {
            write: message => {
                info(message.trim());
            }
        }
    });
}

/**
 * Returns a custom formatter for the Winston logging output.
 *
 * @param {*} options the options provided by Winston
 * @returns {string} custom logging formatted string
 */
function formatter(options: any): string {
    const level = winston.config.colorize(options.level, options.level.toUpperCase());
    const spaces = options.level.length === 4 ? "  " : " ";

    return `${showId ? `${correlationId} ` : ""}${timestamp()} ${level}${spaces}${options.message ? options.message : ""}`;
}

/**
 * Returns a formatted timestamp.
 *
 * @returns {string} the formatted timestamp as a string
 */
function timestamp(): string {
    return moment(Date.now()).format(DATE_FORMAT);
}

// Exported properties
export {
    correlationId
};
