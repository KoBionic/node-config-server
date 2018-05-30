import { logger } from '@kobionic/server-lib';

import * as AppUtil from '.';


describe('App Util Test Suite', () => {

    it('should be able to continue', () => {
        expect(AppUtil.canContinue()).toBeTruthy();
    });

    it('should use logger to print application information', async () => {
        logger.info = jest.fn();
        await AppUtil.printAppInformation();

        expect(logger.info).toHaveBeenCalled();
    });

});
