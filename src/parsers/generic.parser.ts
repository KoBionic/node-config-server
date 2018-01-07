import { Container, Services } from "../inversify.config";
import { LoggerService } from "../services/logger/logger.service";
import { injectable } from "inversify";


/**
 * Generic Parser abstract class.
 *
 * @export
 * @abstract
 * @class GenericParser
 */
@injectable()
export abstract class GenericParser {

    /** The application logger. */
    protected logger: LoggerService = Container.get(Services.LOGGER);

    /**
     * Parses the target type stringified object to transform it into a JavaScript object.
     *
     * @abstract
     * @param {string} str the string to parse
     * @returns {*} the parsed target content into a JavaScript object
     * @memberof GenericParser
     */
    public abstract parse(str: string): any;

}
