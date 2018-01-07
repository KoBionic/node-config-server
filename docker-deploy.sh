#!/bin/bash
## Author: Jeremie Rodriguez <contact@jeremierodriguez.com> (https://github.com/jeremiergz)

docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD
docker build -t kobionic/node-config-server:$(npm run version --silent) -t kobionic/node-config-server:latest .
docker push kobionic/node-config-server
