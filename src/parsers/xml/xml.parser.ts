import { GenericParser } from "../generic.parser";
import { injectable } from "inversify";
import { parseString } from "xml2js";


/**
 * Parser for transforming XML string into object.
 *
 * @export
 * @class XMLParser
 * @extends {GenericParser}
 */
@injectable()
export class XMLParser extends GenericParser {

    /**
     * Transform a string into js object.
     *
     * @param {string} str the stringified XML
     * @returns {*} the parsed XML into a JavaScript object
     * @memberof XMLParser
     */
    public parse(str: string): any {
        return new Promise<any>((resolve, reject) => {
            parseString(str, (err, content) => {
                if (err) {
                    this.logger.error(err.message);
                    reject(err);
                }
                resolve(content);
            });

        });
    }

}
