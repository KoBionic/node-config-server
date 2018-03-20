import { readFileSync } from "fs";

import { XMLParser } from ".";


describe("XML Parser Test Suite", () => {

    const xmlParser = new XMLParser();
    const xmlContent = readFileSync(`${__dirname}/test.xml`, "utf8");
    const expectedJson = {
        library: {
            movie: [
                {
                    name: "The Prestige",
                    director: "Christopher Nolan",
                    writer: [
                        "Jonathan Nolan",
                        "Christopher Nolan"
                    ],
                    year: 2006,
                    actor: [
                        "Christian Bale",
                        "Hugh Jackman",
                        "Scarlett Johansson"
                    ],
                    duration: 130,
                    watched: true
                },
                {
                    name: "Wind River",
                    director: "Taylor Sheridan",
                    writer: "Taylor Sheridan",
                    year: 2017,
                    actor: [
                        "Jeremy Renner",
                        "Elizabeth Olsen",
                        "Julia Jones"
                    ],
                    duration: 107,
                    watched: true
                }
            ]
        }
    };

    it("should parse an XML content as expected", async () => {
        const obj = await xmlParser.parse(xmlContent);
        expect(obj).toEqual(expectedJson);
    });

    it("should throw an error when XML content is faulty", async () => {
        await expect(xmlParser.parse(xmlContent.replace("</library>", ""))).rejects.toThrowError();
    });

});
