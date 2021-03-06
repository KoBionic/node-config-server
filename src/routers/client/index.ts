import { Router } from 'express';
import { AppUtil } from '../../utils';
import { router as FileRouter } from './file';
import { router as InfoRouter } from './info';
import { router as LogRouter } from './log';
import { router as TreeRouter } from './tree';


/** The Client router. */
const router = Router()
    .use(AppUtil.CLIENT_URL, FileRouter)
    .use(AppUtil.CLIENT_URL, InfoRouter)
    .use(AppUtil.CLIENT_URL, LogRouter)
    .use(AppUtil.CLIENT_URL, TreeRouter);

export default router;
