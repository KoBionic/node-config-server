import * as os from 'os';


/** The UI client & API version tag. */
const VERSION: string = 'v1';

/** The API URL. */
export const API_URL: string = `/api/${VERSION}`;

/** The UI client URL. */
export const UI_CLIENT_URL: string = `/client/${VERSION}`;

/** The server hostname. */
export const HOST: string = os.hostname().toLowerCase();

/** The server port number. */
export const PORT: string | number = process.env.PORT || 20490;
