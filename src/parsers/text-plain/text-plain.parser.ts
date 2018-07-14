import { GenericParser } from '../generic.parser';


/**
 * Parser for transforming plain text string into object.
 *
 * @export
 * @class TextPlainParser
 * @extends {GenericParser}
 */
export class TextPlainParser extends GenericParser {

    /**
     * Gets a string and passes it on to the caller.
     *
     * @param {string} str the parsed string content
     * @returns {Promise<any>} the passed on string content
     * @memberof TextPlainParser
     */
    public parse(str: string): Promise<any> {
        return Promise.resolve(str);
    }

}
