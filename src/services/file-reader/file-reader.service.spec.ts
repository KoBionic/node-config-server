import { Container, Services } from "../../inversify.config";
import { FileReaderService } from "./file-reader.service";
import * as path from "path";

const DIR = path.resolve(__dirname, "../../..", "config/test/v1");


describe("File Reader Test Suite", () => {

    let fileReaderService: FileReaderService;

    beforeAll(() => {
        fileReaderService = Container.get(Services.FILE_READER);
    });

    it("should read a good JSON file", done => {
        fileReaderService.readFile(DIR, "goodFile.json").then(obj => {
            expect(obj).toMatchObject({ host: "127.0.0.1" });
            done();
        });
    });

    it("should return a string when file has unknown extension", done => {
        fileReaderService.readFile(DIR, "goodFile.jsonx")
            .then(resp => {
                expect(typeof resp).toBe("string");
                done();
            })
            .catch(reason => {
                done(new Error("Test failing"));
            });
    });

    it("should throw an error when reading a bad JSON file", done => {
        fileReaderService.readFile(DIR, "badFile.json")
            .then(resp => {
                done(new Error("Test failing"));
            })
            .catch(reason => {
                expect(reason.name).toBe("SyntaxError");
                done();
            });
    });

    it("should throw an error when directory is not found", done => {
        fileReaderService.readFile("unknownDirectory", "goodFile.json")
            .then(resp => {
                done(new Error("Test failing"));
            })
            .catch(reason => {
                expect(reason.name).toBe("Error");
                done();
            });
    });

    it("should throw an error when directory is not found", done => {
        fileReaderService.readFile("testFile", "goodFile.json")
            .then(resp => {
                done(new Error("Test failing"));
            })
            .catch(reason => {
                expect(reason.name).toBe("Error");
                done();
            });
    });

    it("should throw an error when file is not found", done => {
        fileReaderService.readFile(DIR, "unknownFile.json")
            .then(resp => {
                done(new Error("Test failing"));
            })
            .catch(reason => {
                expect(reason.name).toBe("Error");
                done();
            });
    });

});
