import { logger } from '@kobionic/server-lib';
import { OptionsV2, parseString, processors } from 'xml2js';
import { GenericParser } from '../generic.parser';


/**
 * Parser for transforming XML string into object.
 *
 * @export
 * @class XMLParser
 * @extends {GenericParser}
 */
export class XMLParser extends GenericParser {

    /**
     * Transforms an XML string into a JavaScript object.
     *
     * @param {string} str the stringified XML
     * @returns {Promise<any>} the parsed XML as a JavaScript object
     * @memberof XMLParser
     */
    public parse(str: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const options: OptionsV2 = {
                explicitArray: false,
                trim: true,
                valueProcessors: [
                    processors.parseNumbers,
                    processors.parseBooleans,
                ],
            };
            parseString(str, options, (err, content) => {
                if (err) {
                    logger.error(err.message);
                    reject(err);
                }
                resolve(content);
            });
        });
    }

}
