import { logger } from '@kobionic/server-lib';
import { readFile } from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { GenericParser, INIParser, JSONParser, PlainTextParser, PropertiesParser, XMLParser, YAMLParser } from '../../parsers';
import { FileType } from './file-type.type';
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
     * @param {FileType} [format] the parsing format to enforce
     * @returns {Promise<any>} the file content
     * @memberof FileReaderService
     */
    public async readFile(dir: string, file: string, format?: FileType): Promise<any> {
        let obj;
        try {
            let fileType = <FileType>file.substring(file.lastIndexOf('.') + 1).toLowerCase();
            logger.debug(`File type: ${fileType}`);

            const pathToFile = path.resolve(`${dir}/${file}`);
            logger.debug(`File path: ${pathToFile}`);

            const data = await readFileAsync(pathToFile, 'utf8');

            // Force use of PlainTextParser if format string is provided
            if (format === 'plain-text') {
                logger.debug(`Format: ${format}`);
                fileType = 'plain-text';
            }

            let parser: GenericParser;

            switch (fileType) {
                case 'ini':
                    parser = new INIParser();
                    break;
                case 'json':
                    parser = new JSONParser();
                    break;
                case 'properties':
                    parser = new PropertiesParser();
                    break;
                case 'xml':
                case 'xsd':
                    parser = new XMLParser();
                    break;
                case 'yaml':
                case 'yml':
                    parser = new YAMLParser();
                    break;
                default:
                    logger.debug(`Unknown or forced file type: ${fileType}`);
                    parser = new PlainTextParser();
            }
            // Parse data using the correct parser
            obj = await parser.parse(data);

        } catch (err) {
            logger.debug(`Error when reading file: ${err.message}`);
            throw err;
        }
        return obj;
    }

}
