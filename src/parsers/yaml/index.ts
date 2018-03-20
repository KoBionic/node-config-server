import { safeLoad } from "js-yaml";

import { logger } from "../../services";
import { GenericParser } from "../generic.parser";


/**
 * Parser for transforming YAML string into object.
 *
 * @export
 * @class YAMLParser
 * @extends {GenericParser}
 */
export class YAMLParser extends GenericParser {

    /**
     * Transforms a YAML string into a JavaScript object.
     *
     * @param {string} str the stringified YAML
     * @returns {Promise<any>} the parsed YAML as a JavaScript object
     * @memberof YAMLParser
     */
    public parse(str: string): Promise<any> {
        try {
            return Promise.resolve(safeLoad(str));

        } catch (err) {
            logger.error(err.message);

            return Promise.reject(err);
        }
    }

}
