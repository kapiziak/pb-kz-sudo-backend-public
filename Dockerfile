# syntax=docker/dockerfile:1

FROM node:18-alpine
WORKDIR /app

RUN mkdir -p /app/node_modules && chown -R node:node /app
COPY package*.json ./

USER node

RUN yarn

COPY --chown=node:node . .

RUN npx prisma generate

RUN yarn run build

RUN chmod +x /app/docker-run.sh

CMD ["/bin/sh", "docker-run.sh"]
EXPOSE 3000