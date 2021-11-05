FROM node:14.17-alpine AS build

WORKDIR /app

RUN yarn global add pm2

COPY . /app

RUN yarn install --silent

RUN yarn build

ENV PATH /app/node_modules/.bin:$PATH

CMD ["pm2-runtime", "start", "build/index.js"]
