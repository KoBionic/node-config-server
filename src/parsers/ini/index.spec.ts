import { readFileSync } from "fs";

import { INIParser } from ".";


describe("JSON Parser Test Suite", () => {

    const iniParser = new INIParser();
    const iniContent = readFileSync(`${__dirname}/test.ini`, "utf8");
    const expectedJson = {
        inline: true,
        metadata: {
            "best-actor": "Leonardo DiCaprio",
            "best-movie": "Interstellar"
        },
        movies: {
            Hostiles: true,
            "The Prestige": true,
            "Wind River": true
        }
    };

    it("should parse an INI content as expected", async () => {
        const obj = await iniParser.parse(iniContent);
        expect(obj).toEqual(expectedJson);
    });

});
