import { FileType } from "../../models/file-type.enum";
import { LoggerService } from "../logger/logger.service";
import { Container, Parsers, Services } from "../../inversify.config";
import { GenericParser } from "../../parsers/generic.parser";
import { injectable } from "inversify";
import { promisify } from "util";
import { readFile } from "fs";
import * as path from "path";
const readFileAsync = promisify(readFile);


/**
 * File Reader service.
 *
 * @export
 * @class FileReaderService
 */
@injectable()
export class FileReaderService {

    /** The application logger. */
    private logger: LoggerService;


    /**
     * Default constructor.
     *
     * @memberof FileReaderService
     */
    constructor() {
        this.logger = Container.get(Services.LOGGER);
    }


    /**
     * Asynchronously reads a directory and search for specified file and returns its content.
     *
     * @param {string} dir the directory to read
     * @param {string} file the file to look for
     * @returns {Promise<any>} the file content
     * @memberof FileReaderService
     */
    public async readFile(dir: string, file: string): Promise<any> {
        try {
            const fileType = file.substring(file.lastIndexOf(".") + 1);
            this.logger.debug("File type:", fileType);

            const pathToFile = path.resolve(`${dir}/${file}`);
            this.logger.debug("File path:", pathToFile);

            // Read file
            const data = await readFileAsync(pathToFile, "utf8");

            // Parse file
            let obj = {};
            let parser: GenericParser;

            switch (fileType.toLowerCase()) {
                case FileType.JSON:
                    parser = Container.get(Parsers.JSON);
                    break;

                default:
                    this.logger.debug("Unknown file type:", fileType);
                    parser = Container.get(Parsers.PLAIN_TEXT);
            }

            // Parse data using the correct parser
            obj = parser.parse(data);

            return obj;

        } catch (err) {
            this.logger.debug("Error when reading file:", err.message);
            throw err;
        }
    }

}
