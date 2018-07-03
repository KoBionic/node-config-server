import { logger } from '@kobionic/server-lib';
import * as AppUtil from '.';
import { ConfigurationService } from '../../services';


describe('App Util Test Suite', () => {

    it('should be able to continue', async () => {
        const appConfig = await ConfigurationService.Instance.get();
        expect(AppUtil.canContinue(appConfig.baseDirectory)).toBeTruthy();
    });

    it('should use logger to print application information', async () => {
        logger.info = jest.fn();
        await AppUtil.printAppInformation();

        expect(logger.info).toHaveBeenCalled();
    });

});
