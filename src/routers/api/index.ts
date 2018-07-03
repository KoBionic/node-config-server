import { Router } from 'express';
import { AppUtil } from '../../utils';
import { router as ConfigReaderRouter } from './config-reader';


/** The API endpoint URL. */
const API_URL: string = `/api/${AppUtil.ENDPOINTS_VERSION}`;

/** The API router. */
const router = Router()
    .use(`${API_URL}/*`, ConfigReaderRouter);

export {
    API_URL,
    router as APIRouter,
};
