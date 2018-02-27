import * as os from "os";


/** The API URL. */
export const API_URL: string = "/api/v1";

/** The server hostname. */
export const HOST: string = os.hostname().toLowerCase();

/** The server port number. */
export const PORT: string | number = process.env.PORT || 20490;

/**
 * Returns the CPUs number, either getting it from an environment variable or by the OS.
 *
 * @export
 * @returns {number} the number of CPUs
 */
export function getCpusNumber(): number {
    const osNumber = os.cpus().length;
    const envNumber = parseInt(process.env.CPUS_NUMBER, 10);
    const cpus = envNumber ? envNumber : osNumber;

    return cpus <= 0 ? osNumber : cpus;
}
