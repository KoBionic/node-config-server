import { FileType } from "../../models/file-type.enum";
import { GenericParser } from "../../parsers/generic.parser";
import { JSONParser } from "../../parsers/json/json.parser";
import { PlainTextParser } from "../../parsers/plain-text/plain-text.parser";
import { XMLParser } from "../../parsers/xml/xml.parser";
import { YAMLParser } from "../../parsers/yaml/yaml.parser";
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
                    parser = new JSONParser();
                    break;

                case FileType.XML:
                    parser = new XMLParser();
                    break;

                case FileType.YAML:
                case FileType.YML:
                    parser = new YAMLParser();
                    break;

                default:
                    logger.debug("Unknown file type:", fileType);
                    parser = new PlainTextParser();
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
