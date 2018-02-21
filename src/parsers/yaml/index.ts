import { GenericParser } from "../generic.parser";
import { logger } from "../../services";
import { safeLoad } from "js-yaml";


/**
 * Parser for transforming YAML string into object.
 *
 * @export
 * @class YAMLParser
 * @extends {GenericParser}
 */
export class YAMLParser extends GenericParser {

    /**
     * Transform a string into js object.
     *
     * @param {string} str the stringified YAML
     * @returns {*} the parsed YAML into a JavaScript object
     * @memberof YAMLParser
     */
    public parse(str: string): any {
        try {
            return safeLoad(str);

        } catch (err) {
            logger.error(err.message);
            throw err;
        }
    }

}
