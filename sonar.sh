#!/bin/sh
VERSION=$(npm run version --silent)
sonar-scanner -X -Dsonar.projectVersion=${VERSION}
