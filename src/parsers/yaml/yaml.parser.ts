import { GenericParser } from "../generic.parser";
import { safeLoad } from "js-yaml";
import { injectable } from "inversify";
import * as logger from "../../services/logger";


/**
 * Parser for transforming YAML string into object.
 *
 * @export
 * @class YAMLParser
 * @extends {GenericParser}
 */
@injectable()
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
