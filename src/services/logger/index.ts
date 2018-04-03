import { RequestHandler } from "express";
import * as fs from "fs";
import * as moment from "moment";
import * as morgan from "morgan";
import * as path from "path";
import { promisify } from "util";
import { v1 as uuid } from "uuid";
import * as winston from "winston";

import { AppUtil } from "../../utils";
import { WSTransport } from "./transports";

const mkdir = promisify(fs.mkdir);
const stat = promisify(fs.stat);


// Service identifier used in logs
const correlationId = uuid();
const showId = process.env.LOG_PRINT_ID === "true" ? true : false;

const loggerName = process.env.LOG_NAME || "node-config-server";
const logsFolder = process.env.LOG_DIR || "./logs";

const filename = `${logsFolder}/${loggerName}_${moment(Date.now()).format("YYYY-MM-DD")}`;

// Default to create logs directory in app root path if not present
const logDir = process.env.LOG_DIR || path.resolve(__dirname, "..", "logs");
stat(logDir)
    .catch(err => {
        mkdir(logDir);
    });

// Create the logger transports array
const transports: Array<winston.TransportInstance> = [
    new winston.transports.Console({
        formatter: options => formatter(options, true),
        timestamp: () => moment().format(AppUtil.DATE_FORMAT)
    }),
    new winston.transports.File({
        name: "log",
        filename: `${filename}.log`,
        json: false,
        maxsize: 5242880, // 5Mb
        maxFiles: 5,
        formatter: options => formatter(options),
        timestamp: () => moment().format(AppUtil.DATE_FORMAT)
    }),
    new winston.transports.File({
        name: "json",
        filename: `${filename}.json`,
        json: true,
        maxsize: 5242880, // 5Mb
        maxFiles: 5,
        timestamp: () => moment().format(AppUtil.DATE_FORMAT)
    })
];

// Add a WebSocket transport unless specified otherwise
if (process.env.LOG_WEBSOCKET !== "false") transports.push(new WSTransport());

winston.configure({
    level: process.env.LOG_LEVEL || "info",
    transports: transports
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
    return morgan(AppUtil.HTTP_FORMAT, {
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
    return morgan(AppUtil.HTTP_FORMAT, {
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
 * @param {boolean} [colorize=false] whether output should be colorized or not
 * @returns {string} custom logging formatted string
 */
function formatter(options: any, colorize: boolean = false): string {
    const level = colorize
        ? winston.config.colorize(options.level, options.level.toUpperCase())
        : options.level.toUpperCase();
    const spaces = options.level.length === 4 ? "  " : " ";

    return `${showId ? `${correlationId} ` : ""}${AppUtil.timestamp()} ${level}${spaces}${options.message ? options.message : ""}`;
}

// Exported properties
export {
    correlationId,
    filename,
    loggerName
};
