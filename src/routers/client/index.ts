import { Router } from 'express';
import { AppUtil } from '../../utils';
import { router as FileRouter } from './file';
import { router as TreeRouter } from './tree';


/** The Client endpoint URL. */
const CLIENT_URL: string = `/client/${AppUtil.ENDPOINTS_VERSION}`;

/** The Client router. */
const router = Router()
    .use(CLIENT_URL, FileRouter)
    .use(CLIENT_URL, TreeRouter);

export {
    CLIENT_URL,
    router as ClientRouter,
};
