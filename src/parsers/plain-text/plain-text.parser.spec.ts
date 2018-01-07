import { PlainTextParser } from "./plain-text.parser";
import { Container, Parsers } from "../../inversify.config";


describe("Plain Text Parser Test Suite", () => {

    let plainTextParser: PlainTextParser;

    beforeAll(() => {
        plainTextParser = Container.get(Parsers.PLAIN_TEXT);
    });

    it("should parse a file", done => {
        const str = "This is a plain text string";
        const obj = plainTextParser.parse(str);
        expect(obj).toBe("This is a plain text string");
        done();
    });

});
