import { readFileSync } from "fs";

import { JSONParser } from ".";


describe("JSON Parser Test Suite", () => {

    const jsonParser = new JSONParser();
    const jsonContent = readFileSync(`${__dirname}/test.json`, "utf8");
    const expectedJson = {
        library: {
            "The Prestige": {
                actors: [
                    "Christian Bale",
                    "Hugh Jackman",
                    "Scarlett Johansson"
                ],
                director: "Christopher Nolan",
                duration: 130,
                watched: true,
                writers: [
                    "Jonathan Nolan",
                    "Christopher Nolan"
                ],
                year: 2006
            },
            "Wind River": {
                actors: [
                    "Jeremy Renner",
                    "Elizabeth Olsen",
                    "Julia Jones"
                ],
                director: "Taylor Sheridan",
                duration: "107 min",
                watched: true,
                writers: [
                    "Taylor Sheridan"
                ],
                year: 2017
            }
        }
    };

    it("should parse a JSON content as expected", async () => {
        const obj = await jsonParser.parse(jsonContent);
        expect(obj).toEqual(expectedJson);
    });

    it("should throw an error when JSON content is faulty", async () => {
        await expect(jsonParser.parse(jsonContent.replace("\"year\":", ""))).rejects.toThrowError();
    });

});
