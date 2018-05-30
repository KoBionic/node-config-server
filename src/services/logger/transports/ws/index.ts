import * as moment from 'moment';
import * as io from 'socket.io';
import * as stripAnsi from 'strip-ansi';
import { Transport, TransportOptions } from 'winston';

import { NodeConfigServer } from '../../../../node-config-server';


/**
 * WebSocket transport for Winston logger.
 *
 * @export
 * @class WSTransport
 * @extends {Transport}
 */
export class WSTransport extends Transport {

    /** The logging level. */
    public readonly level: string;

    /** The logger name. */
    public readonly name: string;

    /** The logger silent switch. */
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
        this.name = options.name || 'WSTransport';
        this.silent = options.silent || false;

        this.ioServer = io(NodeConfigServer.server);
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
            msg: stripAnsi(msg),
            timestamp: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
            meta: meta,
        };

        this.ioServer.emit('serverLog', JSON.stringify(toLog));
        callback();
    }

}
