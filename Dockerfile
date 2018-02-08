FROM node:8-alpine

LABEL maintainer="Jeremie Rodriguez <contact@jeremierodriguez.com> (https://github.com/jeremiergz)" \
      description="Cloud Configuration Server using a RESTful API serving either entire files or their parsed content."

WORKDIR /app
COPY . .

ENV NODE_ENV=production \
    LOG_DIR=/var/log

RUN npm install

EXPOSE 20490

CMD ["npm", "start"]
