FROM node:8-alpine AS builder

WORKDIR /tmp
COPY . .

RUN npm install && \
    npm run build && \
    npm prune --production && \
    mkdir package && \
    mv dist/ package/ && \
    mv node_modules/ package/ && \
    mv schemas/ package/ && \
    mv package.json LICENSE README.md CONTRIBUTING.md package/

FROM node:8-alpine

LABEL maintainer="Jeremie Rodriguez <contact@jeremierodriguez.com> (https://github.com/jeremiergz)" \
    description="Centralized configuration server providing a dynamic RESTful API, allowing retrieval of entire files content or their parsed properties."

ENV NODE_ENV=production \
    LOG_DIR=/var/log

WORKDIR /app
RUN adduser -DH ncs && chown ncs:ncs /app
USER ncs
COPY --chown=ncs --from=builder /tmp/package ./

EXPOSE 20490

CMD ["npm", "start"]
