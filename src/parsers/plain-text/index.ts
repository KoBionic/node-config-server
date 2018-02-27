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
     * Gets a string and passes it on to the caller.
     *
     * @param {string} str the parsed string content
     * @returns {Promise<any>} the passed on string content
     * @memberof PlainTextParser
     */
    public parse(str: string): Promise<any> {
        return Promise.resolve(str);
    }

}
