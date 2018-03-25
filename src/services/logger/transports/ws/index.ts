import * as moment from "moment";
import * as io from "socket.io";
import { Transport, TransportOptions } from "winston";

import { AppUtil, ServerUtil } from "../../../../utils";


/**
 * WebSocket transport for Winston logger.
 *
 * @export
 * @class WSTransport
 * @extends {Transport}
 */
export class WSTransport extends Transport {

    public readonly level: string;
    public readonly name: string;
    public readonly silent: boolean;

    private ioServer: io.Server;


    /**
     * Creates an instance of WSTransport.
     *
     * @param {TransportOptions} [options] the transport options
     * @memberof WSTransport
     */
    constructor(options: TransportOptions = {}) {
        super();
        this.level = options.level;
        this.name = options.name || "WSTransport";
        this.silent = options.silent || false;

        this.ioServer = io();
        this.ioServer.listen(ServerUtil.LOG_SERVER_PORT);
    }


    /**
     * Logs message through Socket.io.
     *
     * @param {string} level the logging level
     * @param {string} msg the logged message
     * @param {*} meta the logging output metadata
     * @param {(error?: any) => void} callback Winston callback
     * @memberof WSTransport
     */
    public log(level: string, msg: string, meta: any, callback: (error?: any) => void): void {
        if (this.silent) {
            return callback();
        }
        const toLog = {
            level: level.toUpperCase(),
            msg: msg,
            timestamp: moment().format(AppUtil.DATE_FORMAT),
            meta: meta,
        };

        this.ioServer.emit("serverLog", JSON.stringify(toLog));
        callback();
    }

}
