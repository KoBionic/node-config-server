import { Router } from 'express';
import { AppUtil } from '../../utils';
import { router as ConfigReaderRouter } from './config-reader';


/** The API router. */
const router = Router()
    .use(`${AppUtil.API_URL}*`, ConfigReaderRouter);

export default router;
