/** The UI client & API version tag. */
const VERSION: string = 'v1';

/** The API URL. */
export const API_URL: string = `/api/${VERSION}`;

/** The UI client URL. */
export const UI_CLIENT_URL: string = `/client/${VERSION}`;

/**
 * Returns duration time to add to logging output.
 *
 * @private
 * @param {number} start the metric start time
 * @returns {string} the formatted duration string
 * @memberof ConfigService
 */
export function duration(start: number): string {
    return `[${Date.now() - start}ms]`;
}
