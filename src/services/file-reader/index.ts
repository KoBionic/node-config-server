import { FileType } from "../../models/file-type.enum";
import { Container, Parsers } from "../../inversify.config";
import { GenericParser } from "../../parsers/generic.parser";
import { injectable } from "inversify";
import { promisify } from "util";
import { readFile } from "fs";
import * as logger from "../logger";
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
            logger.debug("File type:", fileType);

            const pathToFile = path.resolve(`${dir}/${file}`);
            logger.debug("File path:", pathToFile);

            // Read file
            const data = await readFileAsync(pathToFile, "utf8");

            // Parse file
            let obj = {};
            let parser: GenericParser;

            switch (fileType.toLowerCase()) {
                case FileType.JSON:
                    parser = Container.get(Parsers.JSON);
                    break;

                case FileType.XML:
                    parser = Container.get(Parsers.XML);
                    break;

                case FileType.YAML:
                case FileType.YML:
                    parser = Container.get(Parsers.YAML);
                    break;

                default:
                    logger.debug("Unknown file type:", fileType);
                    parser = Container.get(Parsers.PLAIN_TEXT);
            }

            // Parse data using the correct parser
            obj = await parser.parse(data);

            return obj;

        } catch (err) {
            logger.debug("Error when reading file:", err.message);
            throw err;
        }
    }

}
