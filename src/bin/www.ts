#!/usr/bin/env node
import { logger } from '@kobionic/server-lib';

import { NodeConfigServer } from '../node-config-server';


new NodeConfigServer()
    .start()
    .catch(err => logger.error(`Server was unable to start: ${err.message}`));
