import { parse } from "ini";

import { logger } from "../../services";
import { GenericParser } from "../generic.parser";


/**
 * Parser for transforming INI string into object.
 *
 * @export
 * @class INIParser
 * @extends {GenericParser}
 */
export class INIParser extends GenericParser {

    /**
     * Transforms an INI string into a JavaScript object.
     *
     * @param {string} str the stringified INI
     * @returns {Promise<any>} the parsed INI as a JavaScript object
     * @memberof INIParser
     */
    public parse(str: string): Promise<any> {
        try {
            return Promise.resolve(parse(str));

        } catch (err) {
            logger.error(err.message);

            return Promise.reject(err);
        }
    }

}
