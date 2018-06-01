import { logger } from '@kobionic/server-lib';
import * as ajv from 'ajv';
import { path as rootPath } from 'app-root-path';
import * as chokidar from 'chokidar';
import * as fs from 'fs';
import { merge } from 'lodash';
import { hostname } from 'os';
import { resolve } from 'path';
import { promisify } from 'util';

import AppConfig from '../../models/config.model';
import { ServerUtil } from '../../utils';

const readFile = promisify(fs.readFile);
const stat = promisify(fs.stat);
const writeFile = promisify(fs.writeFile);


/**
 * Configuration service.
 *
 * @export
 * @class ConfigService
 */
export class ConfigService {

    private static _instance: ConfigService;

    private readonly configFilePath: string;
    private readonly configSchema: any;
    private readonly defaultConfig: AppConfig;
    private config: AppConfig;
    private doLoadEnvironment: boolean;
    private schemaValidator: ajv.ValidateFunction;


    /**
     * Creates an instance of ConfigService.
     *
     * @memberof ConfigService
     */
    private constructor() {
        this.doLoadEnvironment = true;
        this.configFilePath = resolve(rootPath, 'ncs.config.json');
        this.configSchema = JSON.parse(fs.readFileSync(resolve(rootPath, 'schemas', 'config_schema_v1.0.json'), 'utf8'));
        this.defaultConfig = JSON.parse(fs.readFileSync(resolve(__dirname, 'default.config.json'), 'utf8'));
        this.schemaValidator = ajv().compile(this.configSchema);
        chokidar.watch(this.configFilePath).on('change', path => this.loadConfig());
    }

    /**
     * Returns a singleton instance of the service.
     *
     * @readonly
     * @static
     * @type {ConfigService}
     * @memberof ConfigService
     */
    public static get Instance(): ConfigService {
        return ConfigService._instance || (ConfigService._instance = new ConfigService());
    }

    /**
     * Returns the application configuration.
     *
     * @returns {Promise<AppConfig>} the application configuration
     * @memberof ConfigService
     */
    public async get(): Promise<AppConfig> {
        if (!this.config) await this.loadConfig();
        return this.config || this.defaultConfig;
    }

    /**
     * Loads the configuration from the file in base directory or creates it from default if non-existant.
     *
     * @private
     * @returns {Promise<void>}
     * @memberof ConfigService
     */
    private async loadConfig(): Promise<void> {
        const loadStart = Date.now();
        let shouldCreate = false;
        let config = this.defaultConfig;

        try {
            const stats = await stat(this.configFilePath);
            if (!stats.isFile()) throw new Error('Configuration file not found, creating from default');
            const fileValue = JSON.parse(await readFile(this.configFilePath, 'utf-8'));

            if (this.validateConfig(fileValue)) {
                config = fileValue;
                logger.info(`Configuration has been ${this.doLoadEnvironment ? '' : 're'}loaded`, ServerUtil.duration(loadStart));
            } else {
                logger.warn('Configuration file is not valid, falling back to default configuration', ServerUtil.duration(loadStart));
            }
            logger.debug(`FileConfig ${JSON.stringify(config, undefined, 2)}`);

        } catch (err) {
            shouldCreate = true;
        }

        if (this.doLoadEnvironment) {
            const envConfig = this.getEnvironment();
            logger.debug(`EnvConfig ${JSON.stringify(envConfig, undefined, 2)}`);
            const merged = merge(config, envConfig);
            logger.debug(`MergedConfig ${JSON.stringify(merged, undefined, 2)}`);
            this.doLoadEnvironment = false;
        }

        this.config = config;
        if (shouldCreate) this.saveConfig(config);
    }

    /**
     * Returns application configuration model initialized using environment variables.
     *
     * @private
     * @returns {*} the configuration loaded from environment
     * @memberof ConfigService
     */
    private getEnvironment(): any {
        const envConfig = {
            baseDirectory: process.env.NODE_CONFIG_DIR,
            eureka: [
                process.env.EUREKA_CLIENT === 'true' ? true : false,
                {
                    registry: {
                        host: process.env.EUREKA_SERVER_HOST,
                        port: process.env.EUREKA_SERVER_PORT ? parseInt(process.env.EUREKA_SERVER_PORT, 10) : undefined,
                    },
                },
            ],
            logging: [
                process.env.LOG_LEVEL === 'none' ? false : true,
                {
                    correlationId: process.env.LOG_PRINT_ID === 'true' ? true : false,
                    directory: process.env.LOG_DIR,
                    enableWebsocket: process.env.LOG_WEBSOCKET === 'true' ? true : false,
                    level: process.env.LOG_LEVEL === 'none' ? 'none' : process.env.LOG_LEVEL,
                    name: process.env.LOG_NAME,
                },
            ],
            server: {
                host: hostname().toLowerCase(),
                port: process.env.PORT ? parseInt(process.env.PORT, 10) : undefined,
            },
            security: {
                enableCors: process.env.CORS === 'false' ? false : true,
                httpHeaders: [
                    process.env.SECURITY === 'false' ? false : true,
                ],
            },
        };
        return envConfig;
    }

    /**
     * Validates the configuration object.
     *
     * @export
     * @param {*} config the configuration object to validate
     * @returns {boolean} true if configuration is valid, false otherwise
     */
    private validateConfig(config: any): boolean {
        return <boolean>this.schemaValidator(config);
    }

    /**
     * Saves given configuration into file.
     *
     * @private
     * @param {AppConfig} config the new configuration to save
     * @memberof ConfigService
     */
    private saveConfig(config: AppConfig): void {
        writeFile(this.configFilePath, `${JSON.stringify(config, undefined, 2)}\n`)
            .catch(err => logger.warn(`Configuration could not be saved into file: ${err.message}`));
    }

}
