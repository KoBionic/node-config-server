import { JSONParser } from ".";


describe("JSON Parser Test Suite", () => {

    const jsonParser = new JSONParser();

    it("should parse an empty object '{}' JSON file", done => {
        const str = "{}";
        const obj = jsonParser.parse(str);
        expect(obj).toMatchObject({});
        done();
    });

    it("should parse a valid JSON file", done => {
        const str = "{ \"extensions\": \"~/cli_extensions\", \"active_mq\": \"test\"}";
        const obj = jsonParser.parse(str);
        expect(obj).toHaveProperty("extensions", "~/cli_extensions");
        expect(obj).toHaveProperty("active_mq", "test");
        expect(obj).toMatchObject({ extensions: "~/cli_extensions", active_mq: "test" });
        done();
    });

    it("should not parse an invalid JSON file", done => {
        const str = "{ coucou je suis un fake json ! }";
        expect(jsonParser.parse.bind(jsonParser, str)).toThrow();
        done();
    });

    it("should not parse an empty JSON file", done => {
        const str = "";
        expect(jsonParser.parse.bind(jsonParser, str)).toThrow();
        done();
    });

});
