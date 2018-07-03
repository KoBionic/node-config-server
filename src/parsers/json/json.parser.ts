import { logger } from '@kobionic/server-lib';
import { GenericParser } from '../generic.parser';


/**
 * Parser for transforming JSON string into object.
 *
 * @export
 * @class JSONParser
 * @extends {GenericParser}
 */
export class JSONParser extends GenericParser {

    /**
     * Transforms a JSON string into a JavaScript object.
     *
     * @param {string} str the stringified JSON
     * @returns {Promise<any>} the parsed JSON as a JavaScript object
     * @memberof JSONParser
     */
    public parse(str: string): Promise<any> {
        try {
            return Promise.resolve(JSON.parse(str));

        } catch (err) {
            logger.error(err.message);
            return Promise.reject(err);
        }
    }

}
