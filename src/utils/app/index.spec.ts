import { logger } from "../../services";
import { promisify } from "util";
import * as AppUtil from ".";


describe("App Util Test Suite", () => {

    it("should be able to continue", () => {
        expect(AppUtil.canContinue()).toBeTruthy();
    });

    it("should use logger to print application information", () => {
        logger.info = jest.fn();
        AppUtil.printAppInformation();

        expect(logger.info).toHaveBeenCalled();
    });

    it("should list the directory and return the correct number of files", () => {
        expect(AppUtil.ls(__dirname).length).toBe(2);
    });

});
