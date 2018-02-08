import "reflect-metadata";
import { Container as InversifyContainer } from "inversify";
import { EurekaClientService } from "./services/eureka-client";
import { FileReaderService } from "./services/file-reader";
import { JSONParser } from "./parsers/json/json.parser";
import { PlainTextParser } from "./parsers/plain-text/plain-text.parser";
import { XMLParser } from "./parsers/xml/xml.parser";
import { YAMLParser } from "./parsers/yaml/yaml.parser";


/** The IoC container. */
const Container = new InversifyContainer();

// Bind parsers
Container.bind<JSONParser>(JSONParser).to(JSONParser).inSingletonScope();
Container.bind<PlainTextParser>(PlainTextParser).to(PlainTextParser).inSingletonScope();
Container.bind<XMLParser>(XMLParser).to(XMLParser).inSingletonScope();
Container.bind<YAMLParser>(YAMLParser).to(YAMLParser).inSingletonScope();

// Bind services
Container.bind<EurekaClientService>(EurekaClientService).to(EurekaClientService).inSingletonScope();
Container.bind<FileReaderService>(FileReaderService).to(FileReaderService).inSingletonScope();

/** Application content parsers. */
const Parsers = {
    JSON: JSONParser,
    PLAIN_TEXT: PlainTextParser,
    XML: XMLParser,
    YAML: YAMLParser
};

/** Application services. */
const Services = {
    EUREKA: EurekaClientService,
    FILE_READER: FileReaderService
};

export { Container, Parsers, Services };
