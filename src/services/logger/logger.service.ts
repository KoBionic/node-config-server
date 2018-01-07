import { RequestHandler } from "express";
import { injectable } from "inversify";
import * as moment from "moment";
import * as morgan from "morgan";
import * as winston from "winston";


/**
 * Logger Service.
 *
 * @export
 * @class LoggerService
 */
@injectable()
export class LoggerService {

    /** The date format used for logging. */
    private readonly DATE_FORMAT: string;

    /** The Morgan HTTP Logger format. */
    private readonly HTTP_FORMAT: string;


    /**
     * Default constructor.
     *
     * @memberof LoggerService
     */
    constructor() {
        this.DATE_FORMAT = "YYYY-MM-DD HH:mm:ss.SSS";
        this.HTTP_FORMAT = ":method :url :status :response-time ms :remote-addr - :user-agent";
        const filename = `node-config-server-${moment(Date.now()).format("YYYY-MM-DD")}.log`;

        winston.configure({
            level: process.env.LOG_LEVEL || "info",
            exitOnError: false,
            transports: [
                new winston.transports.File({
                    filename: `${process.env.LOG_DIR || "./logs"}/${filename}`,
                    json: true,
                    maxsize: 5242880, // 5Mb
                    maxFiles: 5,
                    timestamp: () => moment().format(this.DATE_FORMAT)
                }),
                new winston.transports.Console({
                    formatter: options => this.formatter(options),
                    timestamp: () => moment().format(this.DATE_FORMAT)
                })
            ]
        });
    }


    /**
     * Prints a message on the console with a defined level.
     *
     * @param {string} level the logging level
     * @param {...Array<string>} messages the messages to log
     * @memberof LoggerService
     */
    public log(level: string, ...messages: Array<string>): void {
        winston.log(level, messages.join(" "));
    }

    /**
     * Prints a debug message on the console.
     *
     * @param {...Array<string>} messages the messages to log
     * @memberof LoggerService
     */
    public debug(...messages: Array<string>): void {
        winston.log("debug", messages.join(" "));
    }

    /**
     * Prints an error message on the console.
     *
     * @param {...Array<string>} messages the messages to log
     * @memberof LoggerService
     */
    public error(...messages: Array<string>): void {
        winston.log("error", messages.join(" "));
    }

    /**
     * Prints an info message on the console.
     *
     * @param {...Array<string>} messages the messages to log
     * @memberof LoggerService
     */
    public info(...messages: Array<string>): void {
        winston.log("info", messages.join(" "));
    }

    /**
     * Prints a warn message on the console.
     *
     * @param {...Array<string>} messages the messages to log
     * @memberof LoggerService
     */
    public warn(...messages: Array<string>): void {
        winston.log("warn", messages.join(" "));
    }

    /**
     * Returns an Express RequestHandler error logger using streamed Morgan HTTP logger passed through Winston logger.
     *
     * @returns {RequestHandler} an Express RequestHandler error logger
     * @memberof LoggerService
     */
    public getErrorHTTPLogger(): RequestHandler {
        return morgan(this.HTTP_FORMAT, {
            skip: (req, res) => res.statusCode < 400,
            stream: {
                write: message => {
                    this.error(message.trim());
                }
            }
        });
    }

    /**
     * Returns an Express RequestHandler info logger using streamed Morgan HTTP logger passed through Winston logger.
     *
     * @returns {RequestHandler} an Express RequestHandler info logger
     * @memberof LoggerService
     */
    public getInfoHTTPLogger(): RequestHandler {
        return morgan(this.HTTP_FORMAT, {
            skip: (req, res) => res.statusCode >= 400,
            stream: {
                write: message => {
                    this.info(message.trim());
                }
            }
        });
    }

    /**
     * Returns a custom-formatted output for the Winston logger.
     *
     * @private
     * @param {*} options the options provided by Winston
     * @returns {string} custom formatted output
     * @memberof LoggerService
     */
    private formatter(options: any): string {
        const level = winston.config.colorize(options.level, options.level.toUpperCase());
        const spaces = options.level.length === 4 ? "  " : " ";

        return `${this.timestamp()}\t${level}${spaces}${options.message ? options.message : ""}`;
    }

    /**
     * Returns a formatted timestamp.
     *
     * @private
     * @returns {string} the formatted timestamp as a string
     * @memberof LoggerService
     */
    private timestamp(): string {
        return moment(Date.now()).format(this.DATE_FORMAT);
    }

}
