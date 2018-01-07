import { Container, Services } from "../../inversify.config";
import { LoggerService } from "../logger/logger.service";
import { ServiceStatus } from "../../models/service-status.enum";
import { Eureka } from "eureka-js-client";
import { injectable } from "inversify";
import * as os from "os";


/**
 * Eureka client service.
 *
 * @export
 * @class EurekaClientService
 */
@injectable()
export class EurekaClientService {

    /** The application's health status. */
    public status: ServiceStatus = ServiceStatus.OUT_OF_SERVICE;

    /** The application's description from package.json. */
    public readonly description: string;

    /** The Eureka application ID. */
    public readonly appID: string;

    /** The Eureka vip address. */
    public readonly vipAddress: string;

    /** The application host. */
    public host: string;

    /** The application port number. */
    public port: string | number;

    /** The Eureka Server host. */
    public eurekaServerHost: string;

    /** The Eureka Server port. */
    public eurekaServerPort: string | number;

    /** The Eureka client custom logger to use. */
    public eurekaClientLogger: LoggerService;

    /** The Eureka client instance. */
    private client: any;


    /**
     * Default constructor.
     *
     * @memberof EurekaClientService
     */
    constructor() {
        this.status = ServiceStatus.STARTING;
        this.description = "Configuration server aimed at serving versioned configuration for micro-services.";
        this.appID = "node-config-server";
        this.vipAddress = this.appID;
        this.eurekaServerHost = process.env.EUREKA_SERVER_HOST || os.hostname().toLowerCase();
        this.eurekaServerPort = process.env.EUREKA_SERVER_PORT || 8761;
        this.eurekaClientLogger = Container.get(Services.LOGGER);
    }


    /**
     * Returns a health check on application.
     *
     * @returns {{}} an health check object
     * @memberof EurekaClientService
     */
    public getHealthCheck(): {} {
        return {
            description: this.description,
            status: this.status
        };
    }

    /**
     * Returns information about Eureka client.
     *
     * @returns {{}} an information filled object
     * @memberof EurekaClientService
     */
    public getInfo(): {} {
        return {
            description: this.description,
            appID: this.appID,
            vipAddress: this.vipAddress,
            host: this.host,
            port: this.port,
            eurekaServerHost: this.eurekaServerHost,
            eurekaServerPort: this.eurekaServerPort
        };
    }

    /**
     * Starts the Eureka client.
     *
     * @memberof EurekaClientService
     */
    public start(): void {
        if (this.client) {
            this.client.start();
        }
    }

    /**
     * Stops the Eureka client.
     *
     * @memberof EurekaClientService
     */
    public stop(): void {
        if (this.client) {
            this.client.stop();
        }
    }

    /**
     * Initializes Eureka client.
     *
     * @param {string} host this application's hostname
     * @param {(string | number)} port this application's port
     * @memberof EurekaClientService
     */
    public init(host: string, port: string | number): void {
        this.host = host;
        this.port = port;

        // Stops client if active
        this.stop();
        this.status = ServiceStatus.STARTING;

        this.client = new Eureka(<any>{
            logger: this.eurekaClientLogger,
            instance: {
                app: this.appID,
                hostName: this.host,
                ipAddr: this.host,
                statusPageUrl: `http://${this.host}:${this.port}/info`,
                healthCheckUrl: `http://${this.host}:${this.port}/health`,
                port: {
                    $: this.port,
                    "@enabled": true,
                },
                vipAddress: this.vipAddress,
                dataCenterInfo: {
                    "@class": "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo",
                    name: "MyOwn",
                },
            },
            eureka: {
                host: this.eurekaServerHost,
                port: this.eurekaServerPort,
                servicePath: "/eureka/apps/",
                fetchRegistry: true,
                registerWithEureka: true,
                maxRetries: 10,
                requestRetryDelay: 15000
            },
        });

        this.registerEvents();
    }

    /**
     * Returns instances linked to an application ID.
     *
     * @param {string} appId the looked for service's application ID
     * @returns {Array<string>} an array of instances
     * @memberof EurekaClientService
     */
    public getInstancesByAppId(appId: string): Array<string> {
        return this.client.getInstancesByAppId(appId);
    }

    /**
     * Returns instances linked to a vip address.
     *
     * @param {string} vidAddress the looked for service's vip address
     * @returns {Array<string>} an array of instances
     * @memberof EurekaClientService
     */
    public getInstancesByVipAddress(vidAddress: string): Array<string> {
        return this.client.getInstancesByAppId(vidAddress);
    }

    /**
     * Changes client status on various events.
     *
     * @private
     * @memberof EurekaClientService
     */
    private registerEvents(): void {
        if (this.client) {
            this.client.on("started", () => {
                this.status = ServiceStatus.UP;
            });

            this.client.on("heartbeat", () => {
                this.status = ServiceStatus.UP;
            });

            this.client.on("registryUpdated", () => {
                this.status = ServiceStatus.UP;
            });

            this.client.on("deregistered", () => {
                this.status = ServiceStatus.OUT_OF_SERVICE;
            });
        }
    }

}
