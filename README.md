# Node Config Server

[![npm version](https://img.shields.io/npm/v/@kobionic/node-config-server.svg?style=flat)](https://www.npmjs.com/package/@kobionic/node-config-server)
[![Build Status](https://img.shields.io/travis/KoBionic/node-config-server.svg)](https://travis-ci.org/KoBionic/node-config-server/branches)
[![Dependencies Status](https://img.shields.io/david/kobionic/node-config-server.svg)](https://david-dm.org/kobionic/node-config-server)
[![DevDependencies Status](https://img.shields.io/david/dev/kobionic/node-config-server.svg)](https://david-dm.org/kobionic/node-config-server?type=dev)
[![License](https://img.shields.io/npm/l/@kobionic/node-config-server.svg)](https://github.com/kobionic/node-config-server/blob/master/LICENSE)

Centralized configuration server providing a dynamic RESTful API, allowing retrieval of entire files content or their parsed properties.

## Installation

The Node Config Server project is deployed both on **npm** & the **Docker Hub**.

### npm

```bash
npm install --global @kobionic/node-config-server
```

### Docker

#### Using plain Docker

```bash
docker run -d --name node-config-server kobionic/node-config-server
```

The image basically exposes port 20490, therefore container links will make it available to the linked containers.

If you want to make it available to services running on your host, use the ```-p``` options to publish the port on your host:

```bash
docker run -d -p 20490:20490 --name node-config-server kobionic/node-config-server
```

## Getting Started

First of all, pull this project with Git:

```bash
Using HTTPS:
git clone https://github.com/KoBionic/node-config-server.git

Using SSH:
git clone git@github.com:KoBionic/node-config-server.git
```

### Environment variables

Numerous environment variables can be set to configure the application.

|       Variable       | Type    | Default            | Description                                                              |
| -------------------- | ------- | ------------------ | ------------------------------------------------------------------------ |
| `PORT`               | number  | 20490              | the *port* the server will listen on                                     |
| `CPUS_NUMBER`        | number  | OS core number     | number of servers to instantiate using the *Node.js cluster API*         |
| `LOG_DIR`            | string  | ./logs             | log file *directory*                                                     |
| `LOG_LEVEL`          | string  | info               | set the logging *level* ( debug \| error \| info \| none )               |
| `LOG_NAME`           | string  | node-config-server | log file *name*                                                          |
| `LOG_PRINT_ID`       | boolean | false              | if set to *true*, will add a **correlation ID** to the logging output    |
| `NODE_CONFIG_DIR`    | string  | ./config           | *base directory* where *served files* will be looked for                 |
| `EUREKA_CLIENT`      | boolean | false              | the server will try to register to an **Eureka server** if set to *true* |
| `EUREKA_SERVER_HOST` | string  | localhost          | configures the Eureka server *hostname*                                  |
| `EUREKA_SERVER_PORT` | number  | 8761               | configures the Eureka server *port number*                               |

## Authors

* [**Jeremie Rodriguez**](https://github.com/jeremiergz) <[contact@jeremierodriguez.com](mailto:contact@jeremierodriguez.com)> - Main developer

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.
