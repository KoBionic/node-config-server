import { logger } from '@kobionic/server-lib';
import { parse } from 'properties';

import { GenericParser } from '../generic.parser';


/**
 * Parser for transforming Properties string into object.
 *
 * @export
 * @class PropertiesParser
 * @extends {GenericParser}
 */
export class PropertiesParser extends GenericParser {

    /**
     * Transforms a Properties string into a JavaScript object.
     *
     * @param {string} str the stringified Properties
     * @returns {Promise<any>} the parsed Properties as a JavaScript object
     * @memberof PropertiesParser
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
