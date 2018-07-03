/** The configuration model based on schema v1.0 and enhanced with program-related information. */
type AppConfig = {
    baseDirectory: string;
    server: {
        port: number;
        scheme: string;
    };
    eureka: [
        boolean,
        {
            registry: {
                host: string;
                port: number;
            };
        }
    ];
    logging: [
        boolean,
        {
            correlationId: boolean;
            directory: string;
            enableWebsocket: boolean;
            level: string;
            name: string;
        }
    ];
    security: {
        enableCors: boolean;
        httpHeaders: [
            boolean,
            {
                dnsPrefetchControl: boolean;
                hidePoweredBy: boolean;
                hsts: {
                    maxAge: number;
                    includeSubDomains: boolean;
                };
                ieNoOpen: boolean;
                noSniff: boolean;
                xssFilter: boolean;
            }
        ];
    };
};

export default AppConfig;
