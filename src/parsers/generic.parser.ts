/**
 * Generic Parser abstract class.
 *
 * @export
 * @abstract
 * @class GenericParser
 */
export abstract class GenericParser {

    /**
     * Parses the target type stringified object to transform it into a JavaScript object.
     *
     * @abstract
     * @param {string} str the string to parse
     * @returns {Promise<any>} the parsed target content into a JavaScript object
     * @memberof GenericParser
     */
    public abstract parse(str: string): Promise<any>;

}
