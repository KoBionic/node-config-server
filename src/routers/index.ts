import { GenericRouter } from "./abstract/generic.router";
import { Router as ClientRouter } from "./client";
import { Router as ConfigReaderRouter } from "./config-reader";
import { Router as EurekaClientRouter } from "./eureka-client";
import { Router as MetricsRouter } from "./metrics";

export {
    GenericRouter,
    ClientRouter,
    ConfigReaderRouter,
    EurekaClientRouter,
    MetricsRouter
};
