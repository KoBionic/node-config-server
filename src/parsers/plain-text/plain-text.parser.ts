import { GenericParser } from "../generic.parser";


/**
 * Parser for transforming plain text string into object.
 *
 * @export
 * @class PlainTextParser
 * @extends {GenericParser}
 */
export class PlainTextParser extends GenericParser {

    /**
     * Transform a string into a JavaScript object.
     *
     * @param {string} str the stringified JSON
     * @returns {*} the parsed JSON into a JavaScript object
     * @memberof PlainTextParser
     */
    public parse(str: string): any {
        return str;
    }

}
