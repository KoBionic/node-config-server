import * as os from "os";


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
