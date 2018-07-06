import { logger } from '@kobionic/server-lib';
import * as ajv from 'ajv';
import { path as rootPath, resolve as rootResolve } from 'app-root-path';
import { readFileSync, statSync, writeFileSync } from 'fs';
import { merge } from 'lodash';
import { join } from 'path';
import AppConfig from '../../services/configuration/configuration.type';


/**
 * Configuration service.
 *
 * @export
 * @class ConfigurationService
 */
export class ConfigurationService {

    private static _instance: ConfigurationService;
    private readonly configFilePath: string;
    private readonly configSchema: any;
    private readonly defaultConfig: AppConfig;
    private doLoadEnvironment: boolean;
    private schemaValidator: ajv.ValidateFunction;
    private _config: AppConfig;


    /**
     * Creates an instance of ConfigurationService.
     *
     * @memberof ConfigurationService
     */
    private constructor() {
        this.doLoadEnvironment = true;
        this.configFilePath = join(rootPath, 'ncs.config.json');
        this.configSchema = JSON.parse(readFileSync(join(rootPath, 'schemas', 'config_schema_v1.0.json'), 'utf8'));
        this.defaultConfig = JSON.parse(readFileSync(join(__dirname, 'default.config.json'), 'utf8'));
        this.schemaValidator = ajv().compile(this.configSchema);
        this.loadConfigSync();
    }

    /**
     * Returns a singleton instance of the service.
     *
     * @readonly
     * @static
     * @type {ConfigurationService}
     * @memberof ConfigurationService
     */
    public static get Instance(): ConfigurationService {
        return ConfigurationService._instance || (ConfigurationService._instance = new ConfigurationService());
    }

    /**
     * Returns the application configuration object.
     *
     * @readonly
     * @type {AppConfig} the application configuration
     * @memberof ConfigurationService
     */
    public get config(): AppConfig {
        return this._config || this.defaultConfig;
    }

    /**
     * Synchronously loads configuration from file in base directory or creates it from default if non-existent.
     *
     * @private
     * @memberof ConfigurationService
     */
    private loadConfigSync(): void {
        let shouldCreate = false;
        let config = this.defaultConfig;

        try {
            const stats = statSync(this.configFilePath);
            if (!stats.isFile()) throw new Error('Configuration file not found, creating from default');
            const fileValue = JSON.parse(readFileSync(this.configFilePath, 'utf-8'));

            if (this.validateConfig(fileValue)) {
                config = fileValue;
            } else {
                logger.warn('Configuration file is not valid, falling back to default configuration');
            }
            logger.debug(`FileConfig ${JSON.stringify(config, undefined, 2)}`);
        } catch (err) {
            shouldCreate = true;
        }

        if (this.doLoadEnvironment) {
            const envConfig = this.getEnvironment();
            logger.debug(`EnvConfig ${JSON.stringify(envConfig, undefined, 2)}`);
            const merged = merge(merge(this.defaultConfig, config), envConfig);
            config = merged;
            logger.debug(`MergedConfig ${JSON.stringify(merged, undefined, 2)}`);
            this.doLoadEnvironment = false;
        }

        config.baseDirectory = rootResolve(config.baseDirectory);
        this._config = config;
        logger.info(`Configuration ${JSON.stringify(config, undefined, 2)}`);
        if (shouldCreate) this.saveConfig(config);
    }

    /**
     * Returns application configuration model initialized using environment variables.
     *
     * @private
     * @returns {object} the configuration loaded from environment
     * @memberof ConfigurationService
     */
    private getEnvironment(): object {
        const authorizedLogLevels = [
            'debug',
            'error',
            'info',
            'none',
            'silly',
            'verbose',
            'warn',
        ];

        const envConfig = {
            baseDirectory: process.env.NODE_CONFIG_DIR,
            eureka: [
                process.env.EUREKA_CLIENT === 'true' ? true : false,
                {
                    registry: {
                        host: process.env.EUREKA_SERVER_HOST,
                        port: process.env.EUREKA_SERVER_PORT,
                    },
                },
            ],
            logging: [
                process.env.LOG_LEVEL === 'none' ? false : true,
                {
                    correlationId: process.env.LOG_PRINT_ID === 'true' ? true : false,
                    directory: process.env.LOG_DIR,
                    enableWebsocket: process.env.LOG_WEBSOCKET === 'true' ? true : false,
                    level: authorizedLogLevels.includes(process.env.LOG_LEVEL) ? process.env.LOG_LEVEL : 'info',
                    name: process.env.LOG_NAME,
                },
            ],
            server: {
                port: process.env.PORT,
            },
            security: {
                enableCors: process.env.CORS === 'true' ? true : false,
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
     * @memberof ConfigurationService
     */
    private saveConfig(config: AppConfig): void {
        try {
            writeFileSync(this.configFilePath, `${JSON.stringify(config, undefined, 2)}\n`);
        } catch (err) {
            logger.warn(`Configuration could not be saved into file: ${err.message}`);
        }
    }

}
