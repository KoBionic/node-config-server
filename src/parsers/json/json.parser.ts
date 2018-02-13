import { GenericParser } from "../generic.parser";
import * as logger from "../../services/logger";


/**
 * Parser for transforming JSON string into object.
 *
 * @export
 * @class JSONParser
 * @extends {GenericParser}
 */
export class JSONParser extends GenericParser {

    /**
     * Transform a string into js object.
     *
     * @param {string} str the stringified JSON
     * @returns {*} the parsed JSON into a JavaScript object
     * @memberof JSONParser
     */
    public parse(str: string): any {
        try {
            return JSON.parse(str);

        } catch (err) {
            logger.error(err.message);
            throw err;
        }
    }

}
