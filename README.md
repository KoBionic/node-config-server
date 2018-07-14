# Node Config Server

[![npm version](https://img.shields.io/npm/v/@kobionic/node-config-server.svg?style=flat)](https://www.npmjs.com/package/@kobionic/node-config-server)
[![Build Status](https://img.shields.io/travis/KoBionic/node-config-server.svg)](https://travis-ci.org/KoBionic/node-config-server/branches)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=node-config-server&metric=coverage)](https://sonarcloud.io/dashboard?id=node-config-server)
[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=node-config-server&metric=alert_status)](https://sonarcloud.io/dashboard?id=node-config-server)
[![Maintainability](https://sonarcloud.io/api/project_badges/measure?project=node-config-server&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=node-config-server)
[![Security](https://sonarcloud.io/api/project_badges/measure?project=node-config-server&metric=security_rating)](https://sonarcloud.io/dashboard?id=node-config-server)
[![Dependencies Status](https://img.shields.io/david/kobionic/node-config-server.svg)](https://david-dm.org/kobionic/node-config-server)
[![DevDependencies Status](https://img.shields.io/david/dev/kobionic/node-config-server.svg)](https://david-dm.org/kobionic/node-config-server?type=dev)
[![License](https://img.shields.io/npm/l/@kobionic/node-config-server.svg)](https://github.com/kobionic/node-config-server/blob/master/LICENSE)

Centralized configuration server providing a dynamic RESTful API, allowing retrieval of entire files content or their parsed properties.

## Installation

The Node Config Server project is deployed both on **npm** & the **Docker Hub**.
Choose which type of installation meets your requirements and follow the appropriate procedure as described below.

### npm

```bash
npm install --global @kobionic/node-config-server
```

### Docker

#### Using plain-old Docker command

```bash
docker run -d --name node-config-server kobionic/node-config-server
```

The image basically exposes port 20490, therefore container links will make it available to the linked containers.

If you want to make it available to services running on your host, use the ```-p``` options to publish the port on your host:

```bash
docker run -d -p 20490:20490 --name node-config-server kobionic/node-config-server
```

#### Using Docker Compose

With Docker Compose, configuration is as easy as writing a *docker-compose.yml* file such as:

```yaml
version: '3'

services:
  node-config-server:
    image: 'kobionic/node-config-server'
    container_name: 'node-config-server'
    restart: 'always'
    ports:
      - '20490:20490'
    volumes:
      - '/path/to/your/config:/app/config:ro'
```

## Configuration

Configuration of the application is done using environment variables. You can find a list of all available variables by reading this documentation a little bit further.

### Configure with Docker Compose

Configuring the application with Docker Compose only requires adding an **environment** array to your *docker-compose.yml* file.

As an example, if you would like to add a *correlation ID* to the logger, you need to add this to your *docker-compose.yml* file:

```yaml
environment:
  LOG_PRINT_ID: 'true'
```

### Configure by setting OS environment variables

Let's use the example above again and set *LOG_PRINT_ID* to *true* using environment variables, both on Linux & Windows.

#### On Linux

```bash
export LOG_PRINT_ID=true
```

#### On Windows

```cmd
set LOG_PRINT_ID=true
```

### Environment variables

Numerous environment variables can be set to configure the application.

|       Variable       | Type    | Default            | Description                                                              |
| -------------------- | ------- | ------------------ | ------------------------------------------------------------------------ |
| `PORT`               | number  | 20490              | the *port* the server will listen on                                     |
| `LOG_DIR`            | string  | ./logs             | log file *directory*                                                     |
| `LOG_LEVEL`          | string  | info               | set the logging *level* ( debug \| error \| info \| none )               |
| `LOG_NAME`           | string  | node-config-server | log file *name*                                                          |
| `LOG_PRINT_ID`       | boolean | false              | if set to *true*, will add a **correlation ID** to the logging output    |
| `LOG_WEBSOCKET`      | boolean | true               | if set to *true*, will add a **WebSocket transport** to the logger       |
| `NODE_CONFIG_DIR`    | string  | ./config           | *base directory* where *served files* will be looked for                 |
| `EUREKA_CLIENT`      | boolean | false              | the server will try to register to an **Eureka server** if set to *true* |
| `EUREKA_SERVER_HOST` | string  | localhost          | configures the Eureka server *hostname*                                  |
| `EUREKA_SERVER_PORT` | number  | 8761               | configures the Eureka server *port number*                               |

## Authors

* [**Jeremie Rodriguez**](https://github.com/jeremiergz) &lt;[contact@jeremierodriguez.com](mailto:contact@jeremierodriguez.com)&gt; - Main developer

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.
