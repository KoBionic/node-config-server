import { cpus } from "os";

import * as ServerUtil from ".";


describe("Server Util Test Suite", () => {

    describe("# CPUs Number Testing", () => {
        it("should return the number of CPUs as OS cores number", () => {
            expect(ServerUtil.getCpusNumber()).toEqual(cpus().length);
        });

        it("should return the number of CPUs as environment variable", () => {
            process.env.CPUS_NUMBER = "1";

            expect(ServerUtil.getCpusNumber()).toEqual(1);
        });

        it("should return the number of OS cores when environment variable is less or equal to 0", () => {
            process.env.CPUS_NUMBER = "0";
            expect(ServerUtil.getCpusNumber()).toEqual(cpus().length);
            process.env.CPUS_NUMBER = "-1";
            expect(ServerUtil.getCpusNumber()).toEqual(cpus().length);
        });
    });

});
