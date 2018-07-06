import { path as rootPath } from 'app-root-path';
import { logger } from '@kobionic/server-lib';
import * as AppUtil from '.';
import { ConfigurationService } from '../../services';


describe('App Util Test Suite', () => {

    const confService = ConfigurationService.Instance;

    it('should be able to continue', () => {
        const appConfig = confService.config;
        expect(AppUtil.canContinue(appConfig.baseDirectory)).toBeTruthy();
    });

    it('should not be able to continue', () => {
        expect(AppUtil.canContinue('rootPath/package.json')).toBeFalsy();
        expect(AppUtil.canContinue('i/am/a/fake/directory')).toBeFalsy();
    });

    it('should use logger to print application information', async () => {
        logger.info = jest.fn();
        await AppUtil.printAppInformation();
        expect(logger.info).toHaveBeenCalled();
    });

});
