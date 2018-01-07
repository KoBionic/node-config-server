import "reflect-metadata";
import { Container as InversifyContainer } from "inversify";
import { EurekaClientService } from "./services/eureka-client/eureka-client.service";
import { FileReaderService } from "./services/file-reader/file-reader.service";
import { LoggerService } from "./services/logger/logger.service";
import { JSONParser } from "./parsers/json/json.parser";
import { PlainTextParser } from "./parsers/plain-text/plain-text.parser";


/** The IoC container. */
const Container = new InversifyContainer();

// Bind parsers
Container.bind<JSONParser>(JSONParser).to(JSONParser).inSingletonScope();
Container.bind<PlainTextParser>(PlainTextParser).to(PlainTextParser).inSingletonScope();

// Bind services
Container.bind<EurekaClientService>(EurekaClientService).to(EurekaClientService).inSingletonScope();
Container.bind<FileReaderService>(FileReaderService).to(FileReaderService).inSingletonScope();
Container.bind<LoggerService>(LoggerService).to(LoggerService).inSingletonScope();

/** Application content parsers. */
const Parsers = {
    JSON: JSONParser,
    PLAIN_TEXT: PlainTextParser
};

/** Application services. */
const Services = {
    EUREKA: EurekaClientService,
    LOGGER: LoggerService,
    FILE_READER: FileReaderService
};

export { Container, Parsers, Services };
