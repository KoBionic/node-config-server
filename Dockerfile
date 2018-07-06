FROM node:8-alpine AS builder

USER node
WORKDIR /home/node
COPY --chown=node . .

RUN npm install && \
    npm prune --production && \
    mkdir package && \
    mv dist/ \
    node_modules/ \
    schemas/ \
    package.json \
    LICENSE \
    README.md \
    CONTRIBUTING.md \
    package/

FROM node:8-alpine

LABEL maintainer="Jeremie Rodriguez <contact@jeremierodriguez.com> (https://github.com/jeremiergz)" \
    description="Centralized configuration server providing a dynamic RESTful API, allowing retrieval of entire files content or their parsed properties."

ENV NODE_ENV=production

USER node
WORKDIR /home/node
COPY --chown=node --from=builder /home/node/package .

EXPOSE 20490

CMD ["npm", "start"]
