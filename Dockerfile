FROM node:8-alpine

LABEL maintainer="Jeremie Rodriguez <contact@jeremierodriguez.com> (https://github.com/jeremiergz)" \
      description="Centralized configuration server providing a dynamic RESTful API, allowing retrieval of entire files content or their parsed properties."

WORKDIR /app
COPY package.json LICENSE README.md ./

# Copy build files
COPY ./src/ ./src/
COPY ./config/webpack.config.ts ./config/
COPY copyright-notice.txt tsconfig.json ./

RUN npm install && \
    npm run build && \
    npm prune --production && \
    rm -r ./config ./src copyright-notice.txt tsconfig.json

ENV NODE_ENV=production \
    LOG_DIR=/var/log

EXPOSE 20490

CMD ["npm", "start"]
