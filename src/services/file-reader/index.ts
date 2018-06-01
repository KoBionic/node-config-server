import { logger } from '@kobionic/server-lib';
import { readFile } from 'fs';
import * as path from 'path';
import { promisify } from 'util';

import { FileType } from '../../models/file-type.enum';
import { Format } from '../../models/format.enum';
import {
    GenericParser,
    INIParser,
    JSONParser,
    PlainTextParser,
    PropertiesParser,
    XMLParser,
    YAMLParser,
} from '../../parsers';

const readFileAsync = promisify(readFile);


/**
 * File Reader service.
 *
 * @export
 * @class FileReaderService
 */
export class FileReaderService {

    private static _instance: FileReaderService;


    /**
     * Creates an instance of FileReaderService.
     *
     * @memberof FileReaderService
     */
    private constructor() {
    }


    /**
     * Returns a singleton instance of the service.
     *
     * @readonly
     * @static
     * @type {FileReaderService}
     * @memberof FileReaderService
     */
    public static get Instance(): FileReaderService {
        return FileReaderService._instance || (FileReaderService._instance = new FileReaderService());
    }

    /**
     * Asynchronously reads a directory and search for specified file and returns its content.
     *
     * @param {string} dir the directory to read
     * @param {string} file the file to look for
     * @param {Format} [format] forces a parsing format
     * @returns {Promise<any>} the file content
     * @memberof FileReaderService
     */
    public async readFile(dir: string, file: string, format?: Format): Promise<any> {
        try {
            let fileType = file.substring(file.lastIndexOf('.') + 1);
            logger.debug('File type:', fileType);

            const pathToFile = path.resolve(`${dir}/${file}`);
            logger.debug('File path:', pathToFile);

            // Read file
            const data = await readFileAsync(pathToFile, 'utf8');

            // Force use of PlainTextParser if Format.STRING is provided
            if (format === Format.STRING) {
                logger.debug('Format:', format);
                fileType = Format.STRING;
            }

            // Parse file
            let parser: GenericParser;

            switch (fileType.toLowerCase()) {
                case FileType.INI:
                    parser = new INIParser();
                    break;

                case FileType.JSON:
                    parser = new JSONParser();
                    break;

                case FileType.PROPERTIES:
                    parser = new PropertiesParser();
                    break;

                case FileType.XML:
                case FileType.XSD:
                    parser = new XMLParser();
                    break;

                case FileType.YAML:
                case FileType.YML:
                    parser = new YAMLParser();
                    break;

                default:
                    logger.debug('Unknown or forced file type:', fileType);
                    parser = new PlainTextParser();
            }

            // Parse data using the correct parser
            const obj = await parser.parse(data);

            return obj;

        } catch (err) {
            logger.debug('Error when reading file:', err.message);
            throw err;
        }
    }

}
