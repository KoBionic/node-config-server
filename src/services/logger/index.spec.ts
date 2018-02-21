import * as logger from ".";
import * as sinon from "sinon";


describe("Logger Service Test Suite", () => {

    let spy: sinon.SinonSpy;

    describe("Console logging testing", () => {
        it("should print a debug message", () => {
            spy = sinon.spy(logger, "debug");
            logger.debug("Test 'debug' message");
            expect(spy.called).toBeTruthy();
        });

        it("should print an error message", () => {
            spy = sinon.spy(logger, "error");
            logger.error("Test 'error' message");
            expect(spy.called).toBeTruthy();
        });

        it("should print an info message", () => {
            spy = sinon.spy(logger, "info");
            logger.info("Test 'info' message");
            expect(spy.called).toBeTruthy();
        });

        it("should print a log message", () => {
            spy = sinon.spy(logger, "log");
            logger.log("info", "Test 'log' message", "LogService", "application/text");
            expect(spy.called).toBeTruthy();
        });

        it("should print a warn message", () => {
            spy = sinon.spy(logger, "warn");
            logger.warn("Test 'warn' message");
            expect(spy.called).toBeTruthy();
        });
    });

    describe("HTTP logging handlers testing", () => {
        it("should return an HTTP info logging handler", () => {
            const handler = logger.getInfoHTTPLogger();
            expect(handler).toBeInstanceOf(Function);
        });

        it("should return an HTTP error logging handler", () => {
            const handler = logger.getErrorHTTPLogger();
            expect(handler).toBeInstanceOf(Function);
        });
    });

});
