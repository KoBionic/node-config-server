import { FileReaderService } from ".";
import * as path from "path";

const TEST_DIR = path.resolve(__dirname, "../../..", "config/test");


describe("File Reader Test Suite", () => {

    const fileReaderService = new FileReaderService();

    it("should read a good JSON file", done => {
        fileReaderService.readFile(`${TEST_DIR}/v1`, "goodFile.json").then(obj => {
            expect(obj).toMatchObject({ host: "127.0.0.1" });
            done();
        });
    });

    it("should read an XML file", done => {
        fileReaderService.readFile(`${TEST_DIR}/xml`, "default.xml").then(obj => {
            expect(obj).toMatchObject({
                file: {
                    $: {
                        name: "default.xml"
                    },
                    movie: {
                        name: "Wind River",
                        year: 2017
                    }
                }
            });
            done();
        });
    });

    it("should read a YAML file", done => {
        fileReaderService.readFile(`${TEST_DIR}/yaml`, "default.yaml").then(obj => {
            expect(obj).toMatchObject({
                file: "default.yaml",
                movies: [
                    { "The Prestige": { year: 2006 } },
                    { "Wind River": { year: 2017 } }
                ]
            });
            done();
        });
    });

    it("should read a file with a .yml extension as it would with a .yaml extension", done => {
        fileReaderService.readFile(`${TEST_DIR}/yaml`, "default.yml").then(obj => {
            expect(obj).toMatchObject({
                file: "default.yml",
                movies: [
                    { "The Prestige": { year: 2006 } },
                    { "Wind River": { year: 2017 } }
                ]
            });
            done();
        });
    });

    it("should return a string when file has unknown extension", done => {
        fileReaderService.readFile(`${TEST_DIR}/v1`, "goodFile.jsonx")
            .then(resp => {
                expect(typeof resp).toBe("string");
                done();
            })
            .catch(reason => {
                done(new Error("Test failing"));
            });
    });

    it("should throw an error when reading a bad JSON file", done => {
        fileReaderService.readFile(`${TEST_DIR}/v1`, "badFile.json")
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
        fileReaderService.readFile(`${TEST_DIR}/v1`, "unknownFile.json")
            .then(resp => {
                done(new Error("Test failing"));
            })
            .catch(reason => {
                expect(reason.name).toBe("Error");
                done();
            });
    });

});
