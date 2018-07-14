// TODO: make default export
/** Describes a Log object. */
export type Log = {
    level: 'debug' | 'error' | 'info' | 'none' | 'silly' | 'verbose' | 'warn';
    message: string;
    meta?: object;
    timestamp: string;
};
