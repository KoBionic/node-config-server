import { PlainTextParser } from ".";


describe("Plain Text Parser Test Suite", () => {

    const plainTextParser = new PlainTextParser();

    it("should parse a file", done => {
        const str = "This is a plain text string";
        const obj = plainTextParser.parse(str);
        expect(obj).toBe("This is a plain text string");
        done();
    });

});
